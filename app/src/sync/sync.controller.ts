import { Controller } from "@nestjs/common";
import { SlackEventMiddlewareArgs } from "@slack/bolt";
import BoltEvent from "../bolt/decorators/bolt-event.decorator";
import Event from "../bolt/enums/event.enum";
import { UserSyncService } from "./user-sync.service";

@Controller()
export class SyncController {
  constructor(private userSyncService: UserSyncService) {}

  @BoltEvent(Event.USER_PROFILE_CHANGED)
  async userProfileChanged({ event }: SlackEventMiddlewareArgs<"user_profile_changed">) {
    await this.userSyncService.syncUsers(event.user);
  }
}
