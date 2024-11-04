import { OmitType, PickType } from "@nestjs/swagger";
import { Presence } from "../presence.model";

export class UpsertPresenceDto extends OmitType(Presence, ["office", "user"]) {
  userId: string;
}

export class SelectPresenceDto extends PickType(UpsertPresenceDto, ["userId", "date"]) {}

export class SetOfficeDto extends SelectPresenceDto {
  officeId: string;
}
