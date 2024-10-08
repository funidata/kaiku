import { OmitType, PickType } from "@nestjs/swagger";
import { Presence } from "../presence.model";

export class UpsertPresenceDto extends OmitType(Presence, ["office"]) {}

export class SetOfficeDto extends PickType(Presence, ["userId", "date"]) {
  officeId: string;
}
