import {
  EDUCATION_LEVELS,
  PROFESSIONAL_SITUATIONS,
  SEX_OPTIONS,
  VOLUNTEER_TEAMS,
} from "../domain";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from "class-validator";

const SEX = [...SEX_OPTIONS];
const EDU = [...EDUCATION_LEVELS];
const PRO = [...PROFESSIONAL_SITUATIONS];
const TEAMS = VOLUNTEER_TEAMS.map((team) => team.id);

export class CommitteeApplicationDto {
  @ApiProperty({ example: "Mbala" })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({ example: "Kabasele" })
  @IsString()
  @MinLength(1)
  postnom: string;

  @ApiProperty({ example: "Amina" })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ enum: SEX })
  @IsIn(SEX)
  sex: string;

  @ApiProperty({ example: "1998-04-12", description: "Date de naissance (ISO)." })
  @IsString()
  birthDate: string;

  @ApiProperty({ example: "Kinshasa" })
  @IsString()
  @MinLength(1)
  city: string;

  @ApiProperty({ example: "+243810000000" })
  @IsString()
  @MinLength(8)
  whatsapp: string;

  @ApiProperty({ example: "amina@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Identifiant du poste principal." })
  @IsString()
  primaryJobId: string;

  @ApiPropertyOptional({ description: "Deuxième choix de poste, différent du principal." })
  @IsOptional()
  @Transform(({ value }) => value || undefined)
  @IsString()
  secondaryJobId?: string;

  @ApiProperty({ enum: EDU })
  @IsIn(EDU)
  educationLevel: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  fieldOfStudy: string;

  @ApiProperty({ enum: PRO })
  @IsIn(PRO)
  professionalSituation: string;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  yearsOfExperience: number;

  @ApiProperty({ minLength: 20 })
  @IsString()
  @MinLength(20)
  motivation: string;

  @ApiProperty({ minLength: 10 })
  @IsString()
  @MinLength(10)
  experience: string;

  @ApiProperty({ example: "Temps plein, septembre–octobre 2026" })
  @IsString()
  @MinLength(1)
  availability: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value || undefined)
  @IsString()
  linkedin?: string;
}

export class VolunteerApplicationDto {
  @ApiProperty({ example: "Mbala" })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({ example: "Kabasele" })
  @IsString()
  @MinLength(1)
  postnom: string;

  @ApiProperty({ example: "Jean" })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ enum: SEX })
  @IsIn(SEX)
  sex: string;

  @ApiProperty({ example: "2001-06-20", description: "Date de naissance (ISO)." })
  @IsString()
  birthDate: string;

  @ApiProperty({ example: "Kinshasa" })
  @IsString()
  @MinLength(1)
  city: string;

  @ApiProperty({ example: "+243810000000" })
  @IsString()
  @MinLength(8)
  whatsapp: string;

  @ApiProperty({ example: "jean@example.com" })
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value || undefined)
  @IsString()
  organization?: string;

  @ApiProperty({ enum: EDU })
  @IsIn(EDU)
  educationLevel: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  fieldOfStudy: string;

  @ApiProperty({ enum: TEAMS, example: "accueil" })
  @IsIn(TEAMS)
  primaryTeamId: string;

  @ApiPropertyOptional({ enum: TEAMS })
  @IsOptional()
  @Transform(({ value }) => value || undefined)
  @IsIn(TEAMS)
  secondaryTeamId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value || undefined)
  @IsString()
  skills?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value || undefined)
  @IsString()
  eventExperience?: string;

  @ApiProperty({ example: "Français, Lingala" })
  @IsString()
  @MinLength(1)
  languages: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  availability: string;

  @ApiProperty({ minLength: 20, description: "150 mots maximum." })
  @IsString()
  @MinLength(20)
  motivation: string;
}

export class PatchApplicationDto {
  @ApiPropertyOptional({ description: "Statut comité ou volontaire, selon le type de candidature." })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignmentTeamId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignmentZone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignmentLead?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignmentShift?: string;
}

export class ListQueryDto {
  @ApiPropertyOptional({ enum: ["COMMITTEE", "VOLUNTEER"], description: "Filtrer par type de candidature." })
  @IsOptional()
  @IsIn(["COMMITTEE", "VOLUNTEER"])
  kind?: "COMMITTEE" | "VOLUNTEER";

  @ApiPropertyOptional({ description: "Recherche sur nom, e-mail ou WhatsApp." })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  poleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jobId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teamId?: string;

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
