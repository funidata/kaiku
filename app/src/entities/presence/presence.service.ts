import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, In } from "typeorm";
import { BoltService } from "../../bolt/bolt.service";
import { PresenceFilter } from "./dto/presence-filter.dto";
import { SelectPresenceDto, SetOfficeDto, UpsertPresenceDto } from "./dto/presence.dto";
import { Presence, PresenceRepository } from "./presence.model";

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(Presence) private presenceRepository: PresenceRepository,
    private boltService: BoltService,
  ) {}

  async findPresencesByUser(userId: string): Promise<Presence[]> {
    return this.presenceRepository.find({ where: { user: { slackId: userId } } });
  }

  async findByFilter({
    date,
    startDate,
    endDate,
    userGroup,
    ...filters
  }: PresenceFilter): Promise<Presence[]> {
    const dateFilter = date || Between(startDate, endDate);
    const userFilter = await this.createUserFilter(userGroup);
    return this.presenceRepository.find({
      where: { ...filters, date: dateFilter, user: userFilter },
    });
  }

  async remove(presence: SelectPresenceDto) {
    return this.presenceRepository.delete(presence);
  }

  async upsert({ userId, ...presence }: UpsertPresenceDto) {
    return this.presenceRepository.upsert({ userSlackId: userId, ...presence }, [
      "userSlackId",
      "date",
    ]);
  }

  async setOffice({ userId, date, officeId }: SetOfficeDto) {
    await this.upsert({ userId, date });

    return this.presenceRepository.update(
      { user: { slackId: userId }, date },
      {
        office: { id: officeId },
      },
    );
  }

  private async createUserFilter(userGroupHandle: string) {
    // FIXME: Cache bolt user group request!
    const userGroupResult = await this.boltService
      .getBolt()
      .client.usergroups.list({ include_users: true });

    const userGroup = userGroupResult.usergroups.find((group) => group.handle === userGroupHandle);

    if (!userGroup) {
      return null;
    }

    return In(userGroup.users);
  }
}
