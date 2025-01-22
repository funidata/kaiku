import { HttpStatus } from "@nestjs/common";
import { KaikuAppException } from "./kaiku-app.exception";

export class OfficeNotFoundException extends KaikuAppException {
  constructor() {
    super("Office was not found in Slack workspace.", HttpStatus.NOT_FOUND);
  }
}
