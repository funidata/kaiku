import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { SelectPresenceDto, SetOfficeDto, UpsertPresenceDto } from "./dto/presence.dto";
import { Presence, PresenceRepository, PresenceType } from "./presence.model";

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(Presence) private presenceRepository: PresenceRepository,
    private dataSource: DataSource,
  ) {}

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

  // FIXME: Type is wrong and the code below bad because of that. Refactor!
  async upsert(presence: Partial<UpsertPresenceDto>) {
    // Select only existing cols for the upsert operation to avoid overriding
    // existing data with defaults/nulls.
    const primaryKeys = ["userId", "date"];
    const updatableCols = Object.keys(presence).filter((key) => !primaryKeys.includes(key));

    if (updatableCols.length === 0) {
      return;
    }

    return this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Presence)
      .values({ userSlackId: presence.userId, date: presence.date, type: presence.type })
      .orUpdate(updatableCols, ["userSlackId", "date"])
      .execute();
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
