import { Controller, Get, Param, Patch, Query, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { ParticipantAuth } from "../auth/admin-auth";
import { ApiOkData, ApiStandardErrors } from "../http/envelope";
import { UserNotificationListResponse } from "../http/models";
import { UserNotificationsService } from "./user-notifications.service";

type Authed = Request & { user?: { id: string } };

@ApiTags("Espace")
@ApiStandardErrors()
@ParticipantAuth()
@Controller("me/notifications")
export class UserNotificationsController {
  constructor(private readonly notifications: UserNotificationsService) {}

  @Get()
  @ApiOperation({ summary: "Notifications de mon espace" })
  @ApiOkData(UserNotificationListResponse)
  list(@Req() request: Authed, @Query("limit") limit?: string) {
    const take = Number(limit);
    return this.notifications.list(request.user.id, Number.isFinite(take) && take > 0 ? take : 30);
  }

  @Patch("read-all")
  @ApiOperation({ summary: "Tout marquer comme lu" })
  @ApiOkData(UserNotificationListResponse)
  readAll(@Req() request: Authed) {
    return this.notifications.markAllRead(request.user.id);
  }

  @Patch(":id/read")
  @ApiOperation({ summary: "Marquer une notification comme lue" })
  @ApiOkData(UserNotificationListResponse)
  readOne(@Req() request: Authed, @Param("id") id: string) {
    return this.notifications.markRead(request.user.id, id);
  }
}
