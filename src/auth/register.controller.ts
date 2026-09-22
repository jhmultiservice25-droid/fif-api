import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiCreatedData, ApiStandardErrors } from "../http/envelope";
import { SessionUserData } from "../http/models";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./register.dto";

@ApiTags("Auth")
@ApiStandardErrors()
@Controller("register")
export class RegisterController {
  constructor(private readonly auth: AuthService) {}

  @Post("organization")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Créer un compte organisation (j’ai un besoin)" })
  @ApiCreatedData(SessionUserData, "Compte organisation créé. Se connecter ensuite via POST /api/auth/sign-in/email.")
  registerOrganization(@Body() body: RegisterDto) {
    return this.auth.register("ORGANIZATION", body.email, body.password, body.name);
  }

  @Post("innovator")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Créer un compte innovateur (j’ai une solution)" })
  @ApiCreatedData(SessionUserData, "Compte innovateur créé. Se connecter ensuite via POST /api/auth/sign-in/email.")
  registerInnovator(@Body() body: RegisterDto) {
    return this.auth.register("INNOVATOR", body.email, body.password, body.name);
  }
}
