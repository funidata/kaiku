import { Test } from "@nestjs/testing";
import { createMockProvider } from "../../test/mocks/mock-provider.factory";
import { BoltUserService } from "./bolt-user.service";
import { BoltService } from "./bolt.service";

describe("BoltUserService", () => {
  let boltUserService: BoltUserService;
  let boltService: BoltService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [createMockProvider(BoltService), BoltUserService],
    }).compile();

    boltUserService = app.get<BoltUserService>(BoltUserService);
    boltService = app.get<BoltService>(BoltService);
  });

  it("Finds all users", async () => {
    await boltUserService.getUsers();
    expect(boltService.getBolt().client.users.list).toHaveBeenCalledTimes(1);
  });
});
