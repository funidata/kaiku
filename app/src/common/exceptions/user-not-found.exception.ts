import { HttpStatus } from "@nestjs/common";
import { KaikuAppException } from "./kaiku-app.exception";

export class UserNotFoundException extends KaikuAppException {
  constructor() {
    super("User was not found in Slack workspace.", HttpStatus.NOT_FOUND);
  }
}
