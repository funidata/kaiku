import { HttpStatus } from "@nestjs/common";
import { KaikuAppException } from "./kaiku-app.exception";

export class InvalidConfigurationException extends KaikuAppException {
  constructor() {
    super("Kaiku is not correctly configured.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
