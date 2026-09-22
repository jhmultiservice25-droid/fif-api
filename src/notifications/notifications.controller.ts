import { Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminAuth } from "../auth/admin-auth";
import { ApiOkData, ApiStandardErrors } from "../http/envelope";
import { NotificationListResponse } from "../http/models";
import { NotificationsService } from "./notifications.service";

@ApiTags("Admin")
@ApiStandardErrors()
@AdminAuth()
@Controller("admin/notifications")
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "Notifications staff (inbox)" })
  @ApiOkData(NotificationListResponse)
  list(@Query("limit") limit?: string) {
    const take = Number(limit);
    return this.notifications.list(Number.isFinite(take) && take > 0 ? take : 30);
  }

  @Patch("read-all")
  @ApiOperation({ summary: "Marquer toutes les notifications comme lues" })
  @ApiOkData(NotificationListResponse)
  readAll() {
    return this.notifications.markAllRead();
  }

  @Patch(":id/read")
  @ApiOperation({ summary: "Marquer une notification comme lue" })
  @ApiOkData(NotificationListResponse)
  readOne(@Param("id") id: string) {
    return this.notifications.markRead(id);
  }
}
