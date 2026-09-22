import { PROJECT_CAPABILITIES, PROJECT_STAGES, PUBLICATION_CONSENTS, RECORD_STATUSES, SECTORS } from "../domain";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";

const SEC = [...SECTORS];
const CAPS = [...PROJECT_CAPABILITIES];
const STAGES = [...PROJECT_STAGES];
const CONSENTS = [...PUBLICATION_CONSENTS];
const STATUSES = [...RECORD_STATUSES];

export class PatchInnovatorProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organization?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UpsertProjectDto {
  @ApiPropertyOptional({ enum: STATUSES })
  @IsOptional()
  @IsIn(STATUSES)
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  problemSolved?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  solution?: string;

  @ApiPropertyOptional({ enum: SEC, isArray: true })
  @IsOptional()
  @IsArray()
  @IsIn(SEC, { each: true })
  sectors?: string[];

  @ApiPropertyOptional({ enum: CAPS, isArray: true })
  @IsOptional()
  @IsArray()
  @IsIn(CAPS, { each: true })
  capabilities?: string[];

  @ApiPropertyOptional({ enum: STAGES })
  @IsOptional()
  @IsIn(STAGES)
  stage?: string;

  @ApiPropertyOptional({ enum: CONSENTS })
  @IsOptional()
  @IsIn(CONSENTS)
  publicationConsent?: string;
}
