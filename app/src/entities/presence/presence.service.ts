import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SelectPresenceDto, SetOfficeDto, UpsertPresenceDto } from "./dto/presence.dto";
import { Presence, PresenceRepository, PresenceType } from "./presence.model";

@Injectable()
export class PresenceService {
  constructor(@InjectRepository(Presence) private presenceRepository: PresenceRepository) {}

  async findPresencesByUser(userId: string): Promise<Presence[]> {
    return this.presenceRepository.find({ where: { user: { slackId: userId } } });
  }

  async findByFilter(filter: {
    date?: Date;
    officeId?: string;
    type?: PresenceType;
  }): Promise<Presence[]> {
    return this.presenceRepository.find({ where: filter });
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
