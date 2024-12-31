import { PickType } from "@nestjs/swagger";

export class UpsertPresenceDto {
  userId: string;
  date: string;
  remote?: boolean;
  officeId?: string;
}

export class SelectPresenceDto extends PickType(UpsertPresenceDto, ["userId", "date"]) {}

export class SetOfficeDto extends SelectPresenceDto {
  officeId: string;
}
