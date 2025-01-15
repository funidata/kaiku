import { HttpStatus } from "@nestjs/common";
import { KaikuAppException } from "./kaiku-app.exception";

export class UserGroupNotFoundException extends KaikuAppException {
  constructor() {
    super("User group was not found in Slack workspace.", HttpStatus.NOT_FOUND);
  }
}
