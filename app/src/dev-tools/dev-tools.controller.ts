import { Controller } from "@nestjs/common";
import BoltAction from "../bolt/decorators/bolt-action.decorator";
import Action from "../bolt/enums/action.enum";
import { BoltActionArgs } from "../bolt/types/bolt-action-args.type";
import { UserSyncService } from "../sync/user-sync.service";

@Controller()
export class DevToolsController {
  constructor(private userSyncService: UserSyncService) {}

  @BoltAction(Action.SYNC_USERS)
  async syncUsers({ ack }: BoltActionArgs) {
    await ack();
    await this.userSyncService.syncUsers();
  }
}
