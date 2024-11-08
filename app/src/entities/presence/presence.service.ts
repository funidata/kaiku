import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between } from "typeorm";
import { PresenceFilter } from "./dto/presence-filter.dto";
import { SelectPresenceDto, SetOfficeDto, UpsertPresenceDto } from "./dto/presence.dto";
import { Presence, PresenceRepository } from "./presence.model";

@Injectable()
export class PresenceService {
  constructor(@InjectRepository(Presence) private presenceRepository: PresenceRepository) {}

  async findPresencesByUser(userId: string): Promise<Presence[]> {
    return this.presenceRepository.find({ where: { user: { slackId: userId } } });
  }

  async findByFilter({ date, startDate, endDate, ...filter }: PresenceFilter): Promise<Presence[]> {
    const dateFilter = date || Between(startDate, endDate);
    return this.presenceRepository.find({ where: { ...filter, date: dateFilter } });
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
}
