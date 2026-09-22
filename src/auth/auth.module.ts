import { Global, Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { AUTH, createAuth } from "./auth";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MeController } from "./me.controller";
import { RegisterController } from "./register.controller";
import { RolesGuard } from "./roles.guard";
import { SessionAuthGuard } from "./session.guard";

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [AuthController, RegisterController, MeController],
  providers: [
    {
      provide: AUTH,
      useFactory: (prisma: PrismaService) => createAuth(prisma),
      inject: [PrismaService],
    },
    AuthService,
    SessionAuthGuard,
    RolesGuard,
  ],
  exports: [AUTH, SessionAuthGuard, RolesGuard],
})
export class AuthModule {}
