import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  BUDGET_BANDS,
  DIGITIZATION_LEVELS,
  FIKIRI_CHALLENGE,
  ORG_TYPES,
  PRIORITY_LEVELS,
  PROBLEM_DOMAINS,
  PROJECT_CAPABILITIES,
  PROJECT_STAGES,
  PUBLICATION_CONSENTS,
  RECORD_STATUSES,
  SECTORS,
  SOLUTION_TYPES,
  TIMELINES,
  YES_MAYBE_NO,
} from "../domain";
import { ApiOkData, ApiStandardErrors } from "../http/envelope";
import { MarketplaceCatalogResponse } from "../http/models";

@ApiTags("Catalogues")
@ApiStandardErrors()
@Controller("catalogs")
export class CatalogsController {
  @Get("marketplace")
  @ApiOperation({ summary: "Listes fermées pour les fiches besoin et projets" })
  @ApiOkData(MarketplaceCatalogResponse)
  marketplace() {
    return {
      orgTypes: [...ORG_TYPES],
      sectors: [...SECTORS],
      problemDomains: [...PROBLEM_DOMAINS],
      solutionTypes: [...SOLUTION_TYPES],
      priorityLevels: [...PRIORITY_LEVELS],
      timelines: [...TIMELINES],
      yesMaybeNo: [...YES_MAYBE_NO],
      budgetBands: [...BUDGET_BANDS],
      publicationConsents: [...PUBLICATION_CONSENTS],
      fikiriChallenge: [...FIKIRI_CHALLENGE],
      recordStatuses: [...RECORD_STATUSES],
      projectStages: [...PROJECT_STAGES],
      projectCapabilities: [...PROJECT_CAPABILITIES],
      digitizationLevels: [...DIGITIZATION_LEVELS],
    };
  }
}
