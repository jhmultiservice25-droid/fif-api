import { applyDecorators, SetMetadata, type Type } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiPayloadTooLargeResponse,
  ApiProperty,
  ApiPropertyOptional,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from "@nestjs/swagger";

export const SKIP_ENVELOPE_KEY = "skipApiEnvelope";

/** Skip the JSON envelope (CSV, binary, or a handler that writes the response itself). */
export const SkipEnvelope = () => SetMetadata(SKIP_ENVELOPE_KEY, true);

export class ApiErrorBody {
  @ApiProperty({ example: false })
  success: false;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: "Le CV PDF est obligatoire." })
  message: string;

  @ApiPropertyOptional({
    type: [String],
    example: ["email must be an email"],
    description: "Détail de validation, lorsque plusieurs champs sont en cause.",
  })
  errors?: string[];
}

type DataModel = Type<unknown> | Type<unknown>[];

function itemModel(model: DataModel): Type<unknown> {
  const item = Array.isArray(model) ? model[0] : model;
  if (!item) {
    throw new Error("Un modèle OpenAPI est requis.");
  }
  return item;
}

function dataSchema(model: DataModel) {
  if (Array.isArray(model)) {
    return { type: "array" as const, items: { $ref: getSchemaPath(itemModel(model)) } };
  }
  return { $ref: getSchemaPath(model) };
}

export function wrapSuccessSchema(data: object, statusCode = 200) {
  return {
    type: "object" as const,
    required: ["success", "statusCode", "data"],
    properties: {
      success: { type: "boolean" as const, example: true },
      statusCode: { type: "number" as const, example: statusCode },
      data,
    },
  };
}

/** Document a 200 JSON success wrapped in the standard envelope. */
export function ApiOkData(model: DataModel, description?: string) {
  return applyDecorators(
    ApiExtraModels(itemModel(model)),
    ApiOkResponse({
      description: description ?? "Succès",
      schema: wrapSuccessSchema(dataSchema(model), 200),
    }),
  );
}

/** Document a 201 JSON success wrapped in the standard envelope. */
export function ApiCreatedData(model: DataModel, description?: string) {
  return applyDecorators(
    ApiExtraModels(itemModel(model)),
    ApiCreatedResponse({
      description: description ?? "Créé",
      schema: wrapSuccessSchema(dataSchema(model), 201),
    }),
  );
}

/** Document a 200 JSON success whose `data` is one of several models. */
export function ApiOkOneOf(models: Type<unknown>[], description?: string) {
  return applyDecorators(
    ApiExtraModels(...models),
    ApiOkResponse({
      description: description ?? "Succès",
      schema: wrapSuccessSchema({
        oneOf: models.map((model) => ({ $ref: getSchemaPath(model) })),
      }),
    }),
  );
}

/** Shared error shapes for every JSON route. */
export function ApiStandardErrors() {
  return applyDecorators(
    ApiExtraModels(ApiErrorBody),
    ApiBadRequestResponse({
      description: "Requête invalide ou fenêtre de candidature fermée.",
      type: ApiErrorBody,
    }),
    ApiUnauthorizedResponse({
      description: "Jeton manquant ou invalide.",
      type: ApiErrorBody,
    }),
    ApiForbiddenResponse({
      description: "Accès refusé.",
      type: ApiErrorBody,
    }),
    ApiNotFoundResponse({
      description: "Ressource introuvable.",
      type: ApiErrorBody,
    }),
    ApiPayloadTooLargeResponse({
      description: "Fichier trop volumineux (5 Mo maximum pour le CV).",
      type: ApiErrorBody,
    }),
    ApiInternalServerErrorResponse({
      description: "Erreur interne.",
      type: ApiErrorBody,
    }),
  );
}
