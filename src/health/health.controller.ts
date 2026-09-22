import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiOkData, ApiStandardErrors } from "../http/envelope";
import { HealthData } from "../http/models";

@ApiTags("Health")
@ApiStandardErrors()
@Controller("health")
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Liveness" })
  @ApiOkData(HealthData, "Le processus répond.")
  ok() {
    return { ok: true, service: "fif-server" };
  }
}
