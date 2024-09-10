import { Injectable, Logger } from "@nestjs/common";
import { validateSync } from "class-validator";
import { InvalidConfigurationException } from "../exceptions/invalid-configuration.exception";
import { KaikuAppConfiguration } from "./models/kaiku-app-configuration.model";

@Injectable()
export class ConfigService {
  public readonly config = new KaikuAppConfiguration();
  private readonly logger = new Logger(ConfigService.name);

  constructor() {
    // Validate in constructor to exit as early as possible upon invalid configuration.
    this.validate(this.config);
  }

  private validate(config: KaikuAppConfiguration): void {
    const errors = validateSync(config);

    if (errors.length) {
      this.logger.error(errors);
      throw new InvalidConfigurationException();
    }

    this.logger.log("App configuration is valid.");
  }
}
