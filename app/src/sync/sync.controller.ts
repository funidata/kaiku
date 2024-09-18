import { Controller } from "@nestjs/common";
import BoltEvent from "../bolt/decorators/bolt-event.decorator";
import Event from "../bolt/enums/event.enum";
import { UserProfileChangedArgs } from "../bolt/types/user-profile-changed.type";
import { UserSyncService } from "./user-sync.service";

@Controller()
export class SyncController {
  constructor(private userSyncService: UserSyncService) {}

  @BoltEvent(Event.USER_PROFILE_CHANGED)
  async userProfileChanged({ event }: UserProfileChangedArgs) {
    await this.userSyncService.syncUsers(event.user);
  }
}
