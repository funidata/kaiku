import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { SlackEventMiddlewareArgs } from "@slack/bolt";
import { BoltUserService } from "../bolt/bolt-user.service";
import { UserService } from "../entities/user/user.service";

type Member = SlackEventMiddlewareArgs<"user_profile_changed">["event"]["user"];

@Injectable()
export class UserSyncService {
  private logger = new Logger(UserSyncService.name);

  constructor(
    private boltUserService: BoltUserService,
    private userService: UserService,
  ) {}

  /**
   * Synchronize users from Slack to local database.
   *
   * By default, all users are synchronized. Optionally, a single user may be
   * updated by passing their data as `updateOverride` argument.
   */
  async syncUsers(updateOverride?: Member) {
    if (updateOverride) {
      this.logger.log(`Starting user data synchronization for user ${updateOverride.id}.`);
    } else {
      this.logger.log("Starting user data synchronization for all users.");
    }

    const usersToUpdate = updateOverride ? [updateOverride] : await this.boltUserService.getUsers();
    if (!usersToUpdate) {
      this.logger.error("Received an undefined value as user update.");
      throw new InternalServerErrorException();
    }

    const allowedUsers = usersToUpdate.filter(this.appUserFilter).map((user) => ({
      slackId: user.id || "",
      displayName: user.profile?.display_name || "",
      realName: user.profile?.real_name || "",
    }));

    await Promise.all(allowedUsers.map((user) => this.userService.updateBasicInfoOrCreate(user)));

    this.logger.log("User data synchronized.");
  }

  /**
   * Filter out bots, restricted and deleted users, leaving only real app users.
   */
  private appUserFilter(user: Member) {
    return (
      user.id !== "USLACKBOT" &&
      !user.is_bot &&
      !user.is_restricted &&
      !user.is_ultra_restricted &&
      !user.deleted
    );
  }
}
