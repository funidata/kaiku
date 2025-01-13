import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BoltService } from "../../bolt/bolt.service";
import dayjs from "../../common/dayjs";
import { UserGroupNotFoundException } from "../../common/exceptions/user-group-not-found.exception";
import { ConstantPresence, ConstantPresenceRepository } from "./constant-presence.model";
import { DateRange, daterangeTransformer } from "./daterange-transformer";
import { CreateConstantPresence } from "./dto/create-constant-presence.dto";

type ConstantPresenceFilter = {
  userId?: string;
  userGroupHandle?: string;
  remote?: boolean;
};

@Injectable()
export class ConstantPresenceService {
  constructor(
    @InjectRepository(ConstantPresence)
    private constantPresenceRepository: ConstantPresenceRepository,
    private boltService: BoltService,
  ) {}

  async findEffectiveByUserId(userId: string): Promise<ConstantPresence[]> {
    const res = await this.constantPresenceRepository
      .createQueryBuilder("cp")
      .select()
      .leftJoinAndSelect("cp.office", "office")
      .where("cp.user_slack_id = :userId", { userId })
      .andWhere("in_effect @> NOW()::date")
      .getRawAndEntities();

    return res.entities;
  }

  /**
   * Find constant presences overlapping given date range and satisfying
   * optional filters.
   *
   * Overlap is defined as a non-empty union of two date ranges.
   */
  async findByDateRange(
    range: DateRange,
    filters?: ConstantPresenceFilter | undefined,
  ): Promise<ConstantPresence[]> {
    const query = this.constantPresenceRepository
      .createQueryBuilder("cp")
      .select()
      .where("in_effect && :range", { range: daterangeTransformer.to(range) });

    if (filters?.userId) {
      query.andWhere("user_slack_id = :userId", { userId: filters.userId });
    }

    if (filters?.userGroupHandle) {
      const userIds = await this.getUserGroupUsers(filters.userGroupHandle);
      query.andWhere("user_slack_id IN (:...userIds)", { userIds });
    }

    if (filters?.remote !== undefined) {
      query.andWhere("remote = :remote", { remote: filters?.remote });
    }

    const res = await query.getRawAndEntities();
    return res.entities;
  }

  /**
   * Create new constant presences for user.
   *
   * All currently effective constant presence entries will be closed as of the
   * current date. New entries will be effective starting on the current date.
   */
  async closeOldAndCreateMany(userId: string, cps: CreateConstantPresence[]) {
    await this.closeEffectiveCpsByUserId(userId);

    const user = { slackId: userId };
    const inEffect = { start: dayjs(), end: undefined };

    const inserts = cps.map(({ officeId, ...cp }) => ({
      ...cp,
      user,
      inEffect,
      office: officeId ? { id: officeId } : null,
    }));

    await this.constantPresenceRepository.save(inserts);
  }

  private async closeEffectiveCpsByUserId(userId: string) {
    return this.constantPresenceRepository
      .createQueryBuilder()
      .update()
      .set({ inEffect: () => "daterange(lower(in_effect), NOW()::date)" })
      .where("user_slack_id = :userId", { userId })
      .andWhere("in_effect @> NOW()::date")
      .execute();
  }

  async closeEffectiveCpsByUserIdAndDayOfWeek(userId: string, dayOfWeek: number) {
    return this.constantPresenceRepository
      .createQueryBuilder()
      .update()
      .set({ inEffect: () => "daterange(lower(in_effect), NOW()::date)" })
      .where("user_slack_id = :userId", { userId })
      .andWhere("day_of_week = :dayOfWeek", { dayOfWeek })
      .andWhere("in_effect @> NOW()::date")
      .execute();
  }

  private async getUserGroupUsers(userGroupHandle: string): Promise<string[]> {
    const userGroups = await this.boltService.getUserGroups();
    const userGroup = userGroups.find((group) => group.handle === userGroupHandle);

    if (!userGroup) {
      throw new UserGroupNotFoundException();
    }

    return userGroup.users;
  }
}
