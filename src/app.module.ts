import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ApplicationsModule } from "./applications/applications.module";
import { AuthModule } from "./auth/auth.module";
import { CatalogsModule } from "./catalogs/catalogs.module";
import { HealthModule } from "./health/health.module";
import { ApiExceptionFilter } from "./http/exception.filter";
import { TransformInterceptor } from "./http/transform.interceptor";
import { UserNotificationsModule } from "./inbox/user-notifications.module";
import { InnovatorsModule } from "./innovators/innovators.module";
import { JobsModule } from "./jobs/jobs.module";
import { MatchingModule } from "./matching/matching.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { OrganizationsModule } from "./organizations/organizations.module";
import { PolesModule } from "./poles/poles.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    PolesModule,
    JobsModule,
    CatalogsModule,
    OrganizationsModule,
    InnovatorsModule,
    MatchingModule,
    UserNotificationsModule,
    NotificationsModule,
    ApplicationsModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: ApiExceptionFilter },
  ],
})
export class AppModule {}
