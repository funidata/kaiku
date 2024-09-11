import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SetVisibleOfficeDto, UpsertUserSettingsDto } from "./dto/user-settings.dto";
import { UserSettings, UserSettingsRepository } from "./user-settings.model";

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private userSettingsRepository: UserSettingsRepository,
  ) {}

  async upsert(input: UpsertUserSettingsDto) {
    return await this.userSettingsRepository.upsert(input, ["userSlackId"]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async setVisibleOffice({ visibleOfficeId }: SetVisibleOfficeDto) {
    // FIXME:
    // await this.upsert({ userSlackId });
    // FIXME:
    // return this.userSettingsRepository.update(
    //   { userSlackId },
    //   { visibleOffice: { id: visibleOfficeId } },
    // );
  }
}
