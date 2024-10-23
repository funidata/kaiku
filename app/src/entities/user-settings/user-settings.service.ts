import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "../user/user.service";
import { UserSettings, UserSettingsRepository } from "./user-settings.model";

@Injectable()
export class UserSettingsService {
  private readonly logger = new Logger(UserSettingsService.name);

  constructor(
    @InjectRepository(UserSettings)
    private userSettingsRepository: UserSettingsRepository,
    private userService: UserService,
  ) {}

  /**
   * Update user settings by user ID.
   *
   * Update is partial so sparse `update` objects work well.
   */
  async update(userId: string, update: Partial<Omit<UserSettings, "id">>) {
    const user = await this.userService.findPopulatedBySlackId(userId);
    const res = await this.userSettingsRepository.update({ id: user.settings.id }, update);
    this.logger.debug("User settings updated.", res);
  }

  /**
   * Find settings by user ID.
   *
   * This is really just syntactic sugar and under the hood uses the user
   * service to fetch the complete user object and then returns only the
   * settings part.
   */
  async findForUser(userId: string): Promise<UserSettings> {
    const user = await this.userService.findPopulatedBySlackId(userId);
    return user.settings;
  }
}
