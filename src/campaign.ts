import { BadRequestException } from "@nestjs/common";

type CampaignId = "committee" | "volunteer" | "innovation" | "badge";

const CAMPAIGNS: Record<CampaignId, { openAt: string; closeAt: string }> = {
  committee: {
    openAt: "2026-08-29T00:00:00+01:00",
    closeAt: "2026-09-03T23:59:59+01:00",
  },
  volunteer: {
    openAt: "2026-09-08T00:00:00+01:00",
    closeAt: "2026-09-17T23:59:59+01:00",
  },
  innovation: {
    openAt: "2026-09-22T00:00:00+01:00",
    closeAt: "2026-10-25T23:59:59+01:00",
  },
  badge: {
    openAt: "2026-09-22T00:00:00+01:00",
    closeAt: "2026-11-20T23:59:59+01:00",
  },
};

export function assertCampaignOpen(id: CampaignId) {
  const force = process.env.FORCE_APPLICATIONS_OPEN === "true";
  const campaign = CAMPAIGNS[id];
  const now = Date.now();
  const phase = force
    ? "open"
    : now < new Date(campaign.openAt).getTime()
      ? "upcoming"
      : now > new Date(campaign.closeAt).getTime()
        ? "closed"
        : "open";
  if (phase === "upcoming") {
    throw new BadRequestException("Les candidatures ne sont pas encore ouvertes.");
  }
  if (phase === "closed") {
    throw new BadRequestException("Les candidatures sont closes.");
  }
}

export function fullName(lastName: string, postnom: string, firstName: string) {
  return [lastName, postnom, firstName].filter(Boolean).join(" ");
}

const TZ = "Africa/Kinshasa";

export function kinshasaDay(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function lastDays(count: number) {
  const stamp = kinshasaDay(new Date());
  const year = Number(stamp.slice(0, 4));
  const month = Number(stamp.slice(5, 7));
  const day = Number(stamp.slice(8, 10));
  const days: string[] = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(Date.UTC(year, month - 1, day - i));
    days.push(date.toISOString().slice(0, 10));
  }
  return days;
}
