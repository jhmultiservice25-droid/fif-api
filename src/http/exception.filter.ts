import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Response } from "express";
import type { ApiError } from "./api.types";

type HttpExceptionBody = {
  message?: string | string[];
  error?: string;
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const { statusCode, message, errors } = normalizeException(exception);

    if (statusCode >= 500) {
      this.logger.error(exception instanceof Error ? exception.stack : exception);
    }

    const body: ApiError = {
      success: false,
      statusCode,
      message,
      ...(errors ? { errors } : {}),
    };
    response.status(statusCode).json(body);
  }
}

function normalizeException(exception: unknown): {
  statusCode: number;
  message: string;
  errors?: string[];
} {
  if (isMulterError(exception)) {
    if (exception.code === "LIMIT_FILE_SIZE") {
      return {
        statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
        message: "Le fichier est trop volumineux (5 Mo maximum).",
      };
    }
    return { statusCode: HttpStatus.BAD_REQUEST, message: "Fichier invalide." };
  }

  if (exception instanceof HttpException) {
    const statusCode = exception.getStatus();
    const payload = exception.getResponse();
    if (typeof payload === "string") {
      return { statusCode, message: payload };
    }
    if (typeof payload === "object" && payload !== null) {
      const body = payload as HttpExceptionBody;
      if (Array.isArray(body.message)) {
        const errors = body.message.filter(
          (item): item is string => typeof item === "string" && item.trim().length > 0,
        );
        return {
          statusCode,
          message: errors[0] ?? exception.message,
          ...(errors.length ? { errors } : {}),
        };
      }
      if (typeof body.message === "string" && body.message.trim()) {
        return { statusCode, message: body.message };
      }
    }
    return { statusCode, message: exception.message };
  }

  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Une erreur interne est survenue.",
  };
}

function isMulterError(exception: unknown): exception is { code: string } {
  return (
    typeof exception === "object" &&
    exception !== null &&
    "code" in exception &&
    (exception as { name?: string }).name === "MulterError"
  );
}
