import { CacheModule } from "@nestjs/cache-manager";
import { Test } from "@nestjs/testing";
import { App } from "@slack/bolt";
import { ConfigServiceMock } from "../../test/mocks/config-service.mock";
import { BoltService } from "./bolt.service";

jest.mock("@slack/bolt");

describe("BoltService", () => {
  let boltService: BoltService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [BoltService, ConfigServiceMock],
    }).compile();

    boltService = app.get<BoltService>(BoltService);
  });

  describe("Slack connection", () => {
    it("Connection is initialized", async () => {
      await boltService.connect();
      expect(boltService.getBolt()).not.toBeUndefined();
      expect(boltService.getBolt().start).toHaveBeenCalledTimes(1);
    });

    it("Connection is closed cleanly", async () => {
      await boltService.connect();
      await boltService.disconnect();
      expect(boltService["bolt"].stop).toHaveBeenCalledTimes(1);
    });

    it("Returns Bolt instance", async () => {
      await boltService.connect();
      expect(boltService.getBolt()).toBeInstanceOf(App);
    });
  });
});
