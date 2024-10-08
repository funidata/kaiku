import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { SetOfficeDto, UpsertPresenceDto } from "./dto/presence.dto";
import { Presence, PresenceRepository } from "./presence.model";

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(Presence) private presenceRepository: PresenceRepository,
    private dataSource: DataSource,
  ) {}

  async findPresencesByUser(userId: string): Promise<Presence[]> {
    return this.presenceRepository.find({ where: { userId } });
  }

  async remove(presence: Pick<Presence, "userId" | "date">) {
    return this.presenceRepository.delete(presence);
  }

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
      .values(presence)
      .orUpdate(updatableCols, primaryKeys)
      .execute();
  }

  async setOffice({ userId: userId, date, officeId }: SetOfficeDto) {
    await this.upsert({ userId: userId, date });

    return this.presenceRepository.update(
      { userId: userId, date },
      {
        office: { id: officeId },
      },
    );
  }
}
