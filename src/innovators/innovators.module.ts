import { Module } from "@nestjs/common";
import { AdminProjectsController } from "./admin-projects.controller";
import { InnovatorsController } from "./innovators.controller";
import { InnovatorsService } from "./innovators.service";

@Module({
  controllers: [InnovatorsController, AdminProjectsController],
  providers: [InnovatorsService],
  exports: [InnovatorsService],
})
export class InnovatorsModule {}
