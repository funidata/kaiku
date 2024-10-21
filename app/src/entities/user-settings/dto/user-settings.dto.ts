import { OmitType } from "@nestjs/swagger";
import { UserSettings } from "../user-settings.model";

export class UpsertUserSettingsDto extends OmitType(UserSettings, ["officeFilter"]) {}

export class SetVisibleOfficeDto {
  visibleOfficeId: number;
}
