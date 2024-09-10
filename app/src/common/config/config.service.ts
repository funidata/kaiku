import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { InvalidConfigurationException } from "../exceptions/invalid-configuration.exception";
import { KaikuAppConfiguration } from "./kaiku-app-configuration.model";

@Injectable()
export class ConfigService {
  public readonly config: KaikuAppConfiguration;
  private readonly logger = new Logger(ConfigService.name);

  constructor() {
    // Validate in constructor to exit as early as possible upon invalid configuration.
    const config = this.init();
    this.validate(config);
    this.config = config;
  }

  init(): KaikuAppConfiguration {
    const env: Partial<KaikuAppConfiguration> = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nodeEnv: (process.env.NODE_ENV as any) || "development",
    };

    return plainToInstance(KaikuAppConfiguration, env);
  }

  validate(config: KaikuAppConfiguration): void {
    const errors = validateSync(config);

    if (errors.length) {
      this.logger.error(errors);
      throw new InvalidConfigurationException();
    }

    this.logger.log("App configuration is valid.");
  }
}
