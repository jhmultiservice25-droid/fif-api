import { json, urlencoded } from "express";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { mkdir } from "node:fs/promises";
import { AppModule } from "./app.module";
import { AUTH, type AppAuth } from "./auth/auth";
import { mountDocs } from "./docs";

async function bootstrap() {
  await mkdir(process.env.UPLOAD_DIR ?? "./data/uploads", { recursive: true });
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const auth = app.get<AppAuth>(AUTH);
  const { toNodeHandler } = await import("better-auth/node");
  const handler = toNodeHandler(auth);
  const http = app.getHttpAdapter().getInstance() as {
    use: (
      fn: (
        req: { originalUrl?: string; url?: string },
        res: unknown,
        next: () => void,
      ) => unknown,
    ) => void;
  };
  http.use((req, res, next) => {
    const path = (req.originalUrl ?? req.url ?? "").split("?")[0] ?? "";
    if (path === "/api/auth" || path.startsWith("/api/auth/")) {
      return handler(req as never, res as never);
    }
    next();
  });
  app.use(json({ limit: "2mb" }));
  app.use(urlencoded({ extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  mountDocs(app);
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
}

bootstrap();
