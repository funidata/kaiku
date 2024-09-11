import { PickType } from "@nestjs/swagger";
import { User } from "../user.model";

export class UpdateBasicInfoDto extends PickType(User, ["slackId", "displayName", "realName"]) {}
