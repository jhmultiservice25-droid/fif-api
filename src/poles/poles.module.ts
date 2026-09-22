import { Module } from "@nestjs/common";
import { PolesController } from "./poles.controller";

@Module({
  controllers: [PolesController],
})
export class PolesModule {}
