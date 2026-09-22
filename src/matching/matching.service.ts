import { BadGatewayException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import {
  isPublishableConsent,
  MATCH_BATCH_SIZE,
  MATCH_SCORE_NOTIFY_AT,
} from "../domain";
import { PrismaService } from "../prisma/prisma.service";

type RoleUser = { id: string; role?: string };

type NeedRow = {
  id: string;
  priorityChallenge: string;
  problemDomains: string[];
  solutionTypes: string[];
  priority: string;
  timeline: string;
  budgetBand: string;
  publicationConsent: string;
  updatedAt: Date;
  organization: { name: string; sector: string; userId: string };
};

type ProjectRow = {
  id: string;
  title: string;
  problemSolved: string;
  solution: string;
  sectors: string[];
  capabilities: string[];
  stage: string;
  publicationConsent: string;
  updatedAt: Date;
  innovator: { displayName: string; organization: string; userId: string };
};

@Injectable()
export class MatchingService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(user: RoleUser) {
    if (user.role === "ORGANIZATION") {
      const org = await this.prisma.organizationProfile.findUnique({ where: { userId: user.id } });
      if (!org) {
        return [];
      }
      return this.prisma.match.findMany({
        where: { need: { organizationId: org.id } },
        include: { need: true, project: { include: { innovator: true } } },
        orderBy: { score: "desc" },
      });
    }
    if (user.role === "INNOVATOR") {
      const innovator = await this.prisma.innovatorProfile.findUnique({ where: { userId: user.id } });
      if (!innovator) {
        return [];
      }
      const rows = await this.prisma.match.findMany({
        where: {
          project: { innovatorId: innovator.id },
          need: { publicationConsent: { in: ["NAMED", "ANONYMOUS"] } },
        },
        include: { project: true, need: { include: { organization: true } } },
        orderBy: { score: "desc" },
      });
      return rows.map((row) => {
        if (row.need.publicationConsent !== "ANONYMOUS") {
          return row;
        }
        return {
          ...row,
          need: {
            ...row.need,
            organization: { ...row.need.organization, name: "", professionalEmail: "", phone: "", contactName: "" },
          },
        };
      });
    }
    throw new ForbiddenException("Accès refusé.");
  }

  async computeForUser(user: RoleUser, force = false) {
    if (user.role === "ORGANIZATION") {
      return this.computeForOrganization(user.id, force);
    }
    if (user.role === "INNOVATOR") {
      return this.computeForInnovator(user.id, force);
    }
    throw new ForbiddenException("Accès refusé.");
  }

  async adminList() {
    return this.prisma.match.findMany({
      include: {
        need: { include: { organization: true } },
        project: { include: { innovator: true } },
      },
      orderBy: { score: "desc" },
      take: 200,
    });
  }

  async adminCompute(opts: { needId?: string; projectId?: string; force?: boolean }) {
    if (opts.needId) {
      const need = await this.prisma.organizationNeed.findUnique({
        where: { id: opts.needId },
        include: { organization: true },
      });
      if (!need) {
        throw new NotFoundException("Fiche introuvable.");
      }
      return this.matchNeedsToProjects([need], await this.publishableProjects(), opts.force ?? false);
    }
    if (opts.projectId) {
      const project = await this.prisma.innovatorProject.findUnique({
        where: { id: opts.projectId },
        include: { innovator: true },
      });
      if (!project) {
        throw new NotFoundException("Projet introuvable.");
      }
      return this.matchProjectsToNeeds([project], await this.publishableNeeds(), opts.force ?? false);
    }
    const needs = await this.publishableNeeds();
    return this.matchNeedsToProjects(needs, await this.publishableProjects(), opts.force ?? false);
  }

  private async computeForOrganization(userId: string, force: boolean) {
    const org = await this.prisma.organizationProfile.findUnique({ where: { userId } });
    if (!org) {
      throw new NotFoundException("Profil organisation introuvable.");
    }
    const needs = await this.prisma.organizationNeed.findMany({
      where: { organizationId: org.id, status: "SUBMITTED" },
      include: { organization: true },
    });
    return this.matchNeedsToProjects(needs, await this.publishableProjects(), force);
  }

  private async computeForInnovator(userId: string, force: boolean) {
    const innovator = await this.prisma.innovatorProfile.findUnique({ where: { userId } });
    if (!innovator) {
      throw new NotFoundException("Profil innovateur introuvable.");
    }
    const projects = await this.prisma.innovatorProject.findMany({
      where: { innovatorId: innovator.id, status: "SUBMITTED" },
      include: { innovator: true },
    });
    return this.matchProjectsToNeeds(projects, await this.publishableNeeds(), force);
  }

  private publishableNeeds() {
    return this.prisma.organizationNeed.findMany({
      where: {
        status: "SUBMITTED",
        publicationConsent: { in: ["NAMED", "ANONYMOUS"] },
      },
      include: { organization: true },
      take: MATCH_BATCH_SIZE,
      orderBy: { updatedAt: "desc" },
    });
  }

  private publishableProjects() {
    return this.prisma.innovatorProject.findMany({
      where: {
        status: "SUBMITTED",
        publicationConsent: { in: ["NAMED", "ANONYMOUS"] },
      },
      include: { innovator: true },
      take: MATCH_BATCH_SIZE,
      orderBy: { updatedAt: "desc" },
    });
  }

  private async matchNeedsToProjects(needs: NeedRow[], projects: ProjectRow[], force: boolean) {
    const written = [];
    for (const need of needs) {
      const counterparts = await this.filterStale(need, projects, force);
      if (!counterparts.length) {
        continue;
      }
      const results = await this.callOpenAi(
        "need",
        this.needSummary(need),
        counterparts.map((project) => ({ id: project.id, summary: this.projectSummary(project) })),
      );
      written.push(...(await this.upsertMatches(need.id, "need", results, need, counterparts)));
    }
    return written;
  }

  private async matchProjectsToNeeds(projects: ProjectRow[], needs: NeedRow[], force: boolean) {
    const written = [];
    for (const project of projects) {
      const counterparts = await this.filterStaleProject(project, needs, force);
      if (!counterparts.length) {
        continue;
      }
      const results = await this.callOpenAi(
        "project",
        this.projectSummary(project),
        counterparts.map((need) => ({ id: need.id, summary: this.needSummary(need) })),
      );
      written.push(...(await this.upsertMatches(project.id, "project", results, needsById(needs), [project])));
    }
    return written;
  }

  private async filterStale(need: NeedRow, projects: ProjectRow[], force: boolean) {
    if (force) {
      return projects;
    }
    const existing = await this.prisma.match.findMany({ where: { needId: need.id } });
    const byProject = new Map(existing.map((row) => [row.projectId, row]));
    return projects.filter((project) => {
      const row = byProject.get(project.id);
      if (!row) {
        return true;
      }
      return need.updatedAt > row.computedAt || project.updatedAt > row.computedAt;
    });
  }

  private async filterStaleProject(project: ProjectRow, needs: NeedRow[], force: boolean) {
    if (force) {
      return needs;
    }
    const existing = await this.prisma.match.findMany({ where: { projectId: project.id } });
    const byNeed = new Map(existing.map((row) => [row.needId, row]));
    return needs.filter((need) => {
      const row = byNeed.get(need.id);
      if (!row) {
        return true;
      }
      return project.updatedAt > row.computedAt || need.updatedAt > row.computedAt;
    });
  }

  private async upsertMatches(
    sourceId: string,
    source: "need" | "project",
    results: { id: string; score: number; rationale: string }[],
    left: NeedRow | Map<string, NeedRow>,
    projects: ProjectRow[],
  ) {
    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
    const allowed = new Set(results.map((row) => row.id));
    const saved = [];
    for (const result of results) {
      if (!allowed.has(result.id)) {
        continue;
      }
      const score = Math.max(0, Math.min(100, Math.round(result.score)));
      const needId = source === "need" ? sourceId : result.id;
      const projectId = source === "project" ? sourceId : result.id;
      const match = await this.prisma.match.upsert({
        where: { needId_projectId: { needId, projectId } },
        create: {
          needId,
          projectId,
          score,
          rationale: result.rationale.slice(0, 2000),
          model,
        },
        update: {
          score,
          rationale: result.rationale.slice(0, 2000),
          model,
          computedAt: new Date(),
        },
      });
      saved.push(match);
      if (score >= MATCH_SCORE_NOTIFY_AT && !match.notifiedAt) {
        await this.notifyMatch(needId, projectId, score, result.rationale, left, projects, source);
        await this.prisma.match.update({
          where: { id: match.id },
          data: { notifiedAt: new Date() },
        });
      }
    }
    return saved;
  }

  private async notifyMatch(
    needId: string,
    projectId: string,
    score: number,
    rationale: string,
    left: NeedRow | Map<string, NeedRow>,
    projects: ProjectRow[],
    source: "need" | "project",
  ) {
    const need =
      source === "need"
        ? (left as NeedRow)
        : (left as Map<string, NeedRow>).get(needId) ??
          (await this.prisma.organizationNeed.findUnique({
            where: { id: needId },
            include: { organization: true },
          }));
    const project =
      projects.find((row) => row.id === projectId) ??
      (await this.prisma.innovatorProject.findUnique({
        where: { id: projectId },
        include: { innovator: true },
      }));
    if (!need || !project || !("organization" in need) || !("innovator" in project)) {
      return;
    }
    const orgName =
      need.publicationConsent === "ANONYMOUS" ? "une organisation" : need.organization.name || "une organisation";
    const projectTitle = project.title || "un projet";
    const rows: {
      userId: string;
      type: string;
      title: string;
      body: string;
      href: string;
    }[] = [
      {
        userId: need.organization.userId,
        type: "MATCH_FOUND",
        title: "Correspondance avec une solution",
        body: `Un projet (${projectTitle}) correspond à votre défi (${score} %). ${rationale}`,
        href: `/me/matches`,
      },
    ];
    if (isPublishableConsent(need.publicationConsent)) {
      rows.push({
        userId: project.innovator.userId,
        type: "MATCH_FOUND",
        title: "Correspondance avec un besoin",
        body: `Votre solution correspond au défi de ${orgName} (${score} %). ${rationale}`,
        href: `/me/matches`,
      });
    }
    await this.prisma.userNotification.createMany({ data: rows });
  }

  private needSummary(need: NeedRow) {
    const orgName = isPublishableConsent(need.publicationConsent) && need.publicationConsent === "NAMED"
      ? need.organization.name
      : "Organisation (anonyme)";
    return [
      `Organisation: ${orgName}`,
      `Secteur: ${need.organization.sector}`,
      `Défi: ${need.priorityChallenge}`,
      `Domaines: ${need.problemDomains.join(", ")}`,
      `Solutions visées: ${need.solutionTypes.join(", ")}`,
      `Priorité: ${need.priority}`,
      `Délai: ${need.timeline}`,
      `Budget: ${need.budgetBand}`,
    ].join("\n");
  }

  private projectSummary(project: ProjectRow) {
    return [
      `Projet: ${project.title}`,
      `Porteur: ${project.innovator.organization || project.innovator.displayName}`,
      `Problème traité: ${project.problemSolved}`,
      `Solution: ${project.solution}`,
      `Secteurs: ${project.sectors.join(", ")}`,
      `Capacités: ${project.capabilities.join(", ")}`,
      `Stade: ${project.stage}`,
    ].join("\n");
  }

  private async callOpenAi(
    source: "need" | "project",
    focus: string,
    counterparts: { id: string; summary: string }[],
  ) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      throw new BadGatewayException("OPENAI_API_KEY n’est pas configurée.");
    }
    if (!counterparts.length) {
      return [];
    }
    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
    const other = source === "need" ? "projets / solutions" : "besoins / défis";
    const prompt = [
      "Tu fais le matching entre besoins d’organisations et solutions d’innovateurs pour le FIKIRI Innovation Festival 2026.",
      `Voici la fiche de référence:\n${focus}`,
      `Voici les ${other} candidats (id + résumé):`,
      ...counterparts.map((row) => `---\nid: ${row.id}\n${row.summary}`),
      'Réponds uniquement en JSON: {"matches":[{"id":"...","score":0,"rationale":"..."}]}',
      "score est un entier 0-100. Ne retourne que des id présents dans la liste. Ignore les paires peu pertinentes (score < 40).",
    ].join("\n\n");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Tu es un expert en matchmaking innovation / institutions en RDC." },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!response.ok) {
      throw new BadGatewayException("Le matching OpenAI a échoué.");
    }
    const body = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = body.choices?.[0]?.message?.content ?? '{"matches":[]}';
    let parsed: { matches?: { id?: string; score?: number; rationale?: string }[] };
    try {
      parsed = JSON.parse(raw) as typeof parsed;
    } catch {
      throw new BadGatewayException("Réponse OpenAI illisible.");
    }
    const allowed = new Set(counterparts.map((row) => row.id));
    return (parsed.matches ?? [])
      .filter((row) => row.id && allowed.has(row.id))
      .map((row) => ({
        id: row.id as string,
        score: Number(row.score) || 0,
        rationale: String(row.rationale ?? ""),
      }));
  }
}

function needsById(needs: NeedRow[]) {
  return new Map(needs.map((need) => [need.id, need]));
}
