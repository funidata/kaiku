import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import dayjs from "../../common/dayjs";
import { ConstantPresence, ConstantPresenceRepository } from "./constant-presence.model";
import { CreateConstantPresence } from "./dto/create-constant-presence.dto";

@Injectable()
export class ConstantPresenceService {
  constructor(
    @InjectRepository(ConstantPresence)
    private constantPresenceRepository: ConstantPresenceRepository,
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
}
