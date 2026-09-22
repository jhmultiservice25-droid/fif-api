import {
  BUDGET_BANDS,
  FIKIRI_CHALLENGE,
  ORG_TYPES,
  PRIORITY_LEVELS,
  PROBLEM_DOMAINS,
  PUBLICATION_CONSENTS,
  RECORD_STATUSES,
  SECTORS,
  SOLUTION_TYPES,
  TIMELINES,
  YES_MAYBE_NO,
} from "../domain";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from "class-validator";

const ORG = [...ORG_TYPES];
const SEC = [...SECTORS];
const DOMAINS = [...PROBLEM_DOMAINS];
const SOLUTIONS = [...SOLUTION_TYPES];
const PRIORITIES = [...PRIORITY_LEVELS];
const TIMES = [...TIMELINES];
const YMN = [...YES_MAYBE_NO];
const BUDGETS = [...BUDGET_BANDS];
const CONSENTS = [...PUBLICATION_CONSENTS];
const CHALLENGES = [...FIKIRI_CHALLENGE];
const STATUSES = [...RECORD_STATUSES];

export class PatchOrganizationProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: ORG })
  @IsOptional()
  @IsIn(ORG)
  type?: string;

  @ApiPropertyOptional({ enum: SEC })
  @IsOptional()
  @IsIn(SEC)
  sector?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  professionalEmail?: string;
}

export class UpsertNeedDto {
  @ApiPropertyOptional({ enum: STATUSES })
  @IsOptional()
  @IsIn(STATUSES)
  status?: string;

  @ApiPropertyOptional({ description: "Q12 — défi prioritaire (le problème, pas la solution)." })
  @IsOptional()
  @IsString()
  @MinLength(1)
  priorityChallenge?: string;

  @ApiPropertyOptional({ enum: DOMAINS, isArray: true })
  @IsOptional()
  @IsArray()
  @IsIn(DOMAINS, { each: true })
  problemDomains?: string[];

  @ApiPropertyOptional({ enum: SOLUTIONS, isArray: true })
  @IsOptional()
  @IsArray()
  @IsIn(SOLUTIONS, { each: true })
  solutionTypes?: string[];

  @ApiPropertyOptional({ enum: PRIORITIES })
  @IsOptional()
  @IsIn(PRIORITIES)
  priority?: string;

  @ApiPropertyOptional({ enum: TIMES })
  @IsOptional()
  @IsIn(TIMES)
  timeline?: string;

  @ApiPropertyOptional({ enum: YMN })
  @IsOptional()
  @IsIn(YMN)
  pilotWillingness?: string;

  @ApiPropertyOptional({ enum: BUDGETS })
  @IsOptional()
  @IsIn(BUDGETS)
  budgetBand?: string;

  @ApiPropertyOptional({ enum: CONSENTS })
  @IsOptional()
  @IsIn(CONSENTS)
  publicationConsent?: string;

  @ApiPropertyOptional({ enum: CHALLENGES })
  @IsOptional()
  @IsIn(CHALLENGES)
  fikiriChallenge?: string;

  @ApiPropertyOptional({ description: "Autres questions du questionnaire (JSON libre validé côté client)." })
  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}

export class MarketplaceListQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}
