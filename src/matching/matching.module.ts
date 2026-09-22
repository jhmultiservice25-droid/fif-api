import { Module } from "@nestjs/common";
import { AdminMatchingController } from "./admin-matching.controller";
import { MatchingController } from "./matching.controller";
import { MatchingService } from "./matching.service";

@Module({
  controllers: [MatchingController, AdminMatchingController],
  providers: [MatchingService],
  exports: [MatchingService],
})
export class MatchingModule {}
