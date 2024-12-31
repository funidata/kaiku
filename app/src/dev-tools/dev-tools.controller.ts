import { Controller } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import BoltAction from "../bolt/decorators/bolt-action.decorator";
import Action from "../bolt/enums/action.enum";
import { BoltActionArgs } from "../bolt/types/bolt-action-args.type";
import { Office } from "../entities/office/office.model";
import { Presence } from "../entities/presence/presence.model";
import { UserSettings } from "../entities/user-settings/user-settings.model";
import { User } from "../entities/user/user.model";
import { UserSyncService } from "../sync/user-sync.service";

@Controller()
export class DevToolsController {
  constructor(
    private userSyncService: UserSyncService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @BoltAction(Action.SYNC_USERS)
  async syncUsers({ ack }: BoltActionArgs) {
    await ack();
    await this.userSyncService.syncUsers();
  }

  @BoltAction(Action.CLEAR_DATABASE)
  async clearDatabase({ ack }: BoltActionArgs) {
    await ack();

    await Promise.all(
      [Presence, Office, User, UserSettings].map(async (model) =>
        this.dataSource.createQueryBuilder().delete().from(model).execute(),
      ),
    );
  }
}
