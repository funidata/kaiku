import { PickType } from "@nestjs/swagger";
import { PresenceType } from "../presence.model";

export class UpsertPresenceDto {
  userId: string;
  date: string;
  type?: PresenceType;
  officeId?: string;
}

export class SelectPresenceDto extends PickType(UpsertPresenceDto, ["userId", "date"]) {}

export class SetOfficeDto extends SelectPresenceDto {
  officeId: string;
}
