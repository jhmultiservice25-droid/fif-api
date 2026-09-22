import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { ApiErrorBody } from "./http/envelope";
import { OPENAPI_MODELS } from "./http/models";

const TITLE = "FIF 2026 API";
const DESCRIPTION = [
  "API du FIKIRI Innovation Festival 2026.",
  "",
  "**Public.** Catalogue des pôles et postes, dépôt des candidatures comité et volontaires, inscription organisation / innovateur (`POST /register/organization`, `POST /register/innovator`).",
  "**Espace.** Après `POST /api/auth/sign-in/email`, les organisations gèrent leurs fiches besoin (`/me/needs`) et les innovateurs leurs projets (`/me/projects`). Matching OpenAI à la demande : `POST /me/matches/compute`.",
  "**Admin.** Candidatures, stats, CSV, plus `GET /admin/needs`, `/admin/projects`, `/admin/matches`. Le compte staff est provisionné depuis `ADMIN_EMAIL` / `ADMIN_PASSWORD`.",
  "",
  "Les fenêtres de candidature sont définies par l’API. `FORCE_APPLICATIONS_OPEN=true` les ouvre hors calendrier.",
  "",
  "## Enveloppe JSON",
  "Toutes les réponses JSON Nest ont la même forme.",
  "",
  "Succès : `{ success: true, statusCode: 200, data: … }`",
  "",
  "Erreur : `{ success: false, statusCode: 400, message: \"…\", errors?: string[] }`",
  "",
  "Hors enveloppe : l’export CSV (`GET /admin/applications/export.csv`) et les routes Better Auth (`/api/auth/*`).",
].join("\n");

type OpenApiDoc = {
  tags?: { name: string; description?: string }[];
  paths?: Record<string, unknown>;
};

const AUTH_TAG = {
  name: "Auth",
  description:
    "Session Better Auth (cookie HttpOnly) via `POST /api/auth/sign-in/email`. Inscription : `POST /register/organization` ou `POST /register/innovator`. Les rôles ADMIN, ORGANIZATION et INNOVATOR partagent le même cookie ; `/admin/*` reste staff.",
};

const betterAuthUserSchema = {
  type: "object",
  required: ["id", "email", "name"],
  properties: {
    id: { type: "string" },
    email: { type: "string", example: "admin@fikiri.cd" },
    name: { type: "string", example: "FIF Admin" },
    role: { type: "string", example: "ADMIN" },
    emailVerified: { type: "boolean" },
    image: { type: "string", nullable: true },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

/**
 * Better Auth is Express middleware, not a Nest controller, so Swagger never
 * sees /api/auth/*. Attach the staff endpoints so they appear in Scalar.
 */
function attachBetterAuthPaths(document: OpenApiDoc) {
  document.tags ??= [];
  if (!document.tags.some((tag) => tag.name === AUTH_TAG.name)) {
    document.tags.unshift(AUTH_TAG);
  }

  document.paths ??= {};
  document.paths["/api/auth/sign-in/email"] = {
    post: {
      tags: ["Auth"],
      operationId: "signInEmail",
      summary: "Connexion",
      description:
        "Better Auth. Pose le cookie HttpOnly `better-auth.session_token`. Réponse hors enveloppe JSON Nest. Valable pour staff, organisations et innovateurs.",
      security: [],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", format: "email", example: "admin@fikiri.cd" },
                password: { type: "string", format: "password", minLength: 8, example: "changeme" },
                rememberMe: { type: "boolean", default: true },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Session créée. Le cookie de session est posé.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["redirect", "token", "user"],
                properties: {
                  redirect: { type: "boolean" },
                  token: { type: "string", description: "Jeton de session (aussi dans le cookie)." },
                  url: { type: "string", nullable: true },
                  user: betterAuthUserSchema,
                },
              },
            },
          },
        },
        "401": { description: "Email ou mot de passe invalide." },
      },
    },
  };

  document.paths["/api/auth/sign-out"] = {
    post: {
      tags: ["Auth"],
      operationId: "signOut",
      summary: "Déconnexion staff",
      description: "Better Auth. Efface le cookie de session. Réponse hors enveloppe JSON Nest.",
      security: [{ session: [] }],
      responses: {
        "200": {
          description: "Cookie de session retiré.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                },
              },
            },
          },
        },
      },
    },
  };

  document.paths["/api/auth/get-session"] = {
    get: {
      tags: ["Auth"],
      operationId: "getSession",
      summary: "Session Better Auth courante",
      description:
        "Better Auth. Hors enveloppe JSON Nest. Préférer `GET /admin/me` pour le compte staff enveloppé.",
      security: [{ session: [] }],
      responses: {
        "200": {
          description: "Session et utilisateur, ou `null` si aucun cookie.",
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  {
                    type: "object",
                    required: ["session", "user"],
                    properties: {
                      session: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          userId: { type: "string" },
                          expiresAt: { type: "string", format: "date-time" },
                          token: { type: "string" },
                        },
                      },
                      user: betterAuthUserSchema,
                    },
                  },
                  { type: "null" },
                ],
              },
            },
          },
        },
      },
    },
  };
}

/**
 * OpenAPI document + Scalar UI.
 * Spec at `/openapi.json`, interactive docs at `/docs`.
 */
export function mountDocs(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(TITLE)
    .setDescription(DESCRIPTION)
    .setVersion("2026")
    .addTag(AUTH_TAG.name, AUTH_TAG.description)
    .addTag("Organisation", "Espace organisation : profil et fiches besoin.")
    .addTag("Innovateur", "Espace innovateur : profil et projets / solutions.")
    .addTag("Matching", "Correspondances OpenAI à la demande, dans l’espace connecté.")
    .addCookieAuth(
      "better-auth.session_token",
      {
        type: "apiKey",
        in: "cookie",
        description: "Cookie de session posé par POST /api/auth/sign-in/email.",
      },
      "session",
    )
    .addServer("http://localhost:4000", "Local")
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ApiErrorBody, ...OPENAPI_MODELS],
    autoTagControllers: false,
  });
  attachBetterAuthPaths(document);

  const http = app.getHttpAdapter().getInstance() as {
    get: (path: string, handler: (req: unknown, res: { json: (body: unknown) => void }) => void) => void;
  };
  http.get("/openapi.json", (_req, res) => {
    res.json(document);
  });

  app.use(
    "/docs",
    apiReference({
      content: document,
      pageTitle: TITLE,
      theme: "kepler",
      persistAuth: true,
    }),
  );
}
