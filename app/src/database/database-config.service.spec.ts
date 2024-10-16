import { Test } from "@nestjs/testing";
import { omit } from "lodash";
import { createMockProvider } from "../../test/mocks/mock-provider.factory";
import { ConfigService } from "../common/config/config.service";
import { KaikuAppConfiguration } from "../common/config/models/kaiku-app-configuration.model";
import { DatabaseConfigService } from "./database-config.service";

const mockConfig: KaikuAppConfiguration = {
  nodeEnv: "production",
  hideDevTools: true,
  bolt: {
    token: "",
    appToken: "",
    signingSecret: "",
  },
  database: {
    host: "test-host",
    name: "test-name",
    password: "test-pwd",
    port: 1234,
    username: "test-user",
    sslEnabled: false,
  },
} as const;

describe("BoltUserService", () => {
  let dbConfigService: DatabaseConfigService;
  let configService: ConfigService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        DatabaseConfigService,
        createMockProvider(ConfigService, {
          getConfig: jest.fn().mockReturnValue(mockConfig),
        }),
      ],
    }).compile();

    dbConfigService = app.get<DatabaseConfigService>(DatabaseConfigService);
    configService = app.get<ConfigService>(ConfigService);
  });

  it("Database configuration", async () => {
    const dbConfig = dbConfigService.createTypeOrmOptions();

    expect(dbConfig).toEqual({
      type: "postgres",
      database: mockConfig.database.name,
      autoLoadEntities: true,
      synchronize: false,
      ssl: false,
      ...omit(mockConfig.database, ["name", "sslEnabled"]),
    });
  });

  it("SSL gets enabled in correct mode", () => {
    configService.getConfig = jest.fn(() => ({
      ...mockConfig,
      database: { ...mockConfig.database, sslEnabled: true },
    }));
    const dbConfig = dbConfigService.createTypeOrmOptions();

    expect(dbConfig).toMatchObject({
      ssl: { rejectUnauthorized: false },
    });
  });
});
