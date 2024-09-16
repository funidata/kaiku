import { DiscoveryService } from "@golevelup/nestjs-discovery";
import { ModuleRef } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { createMockProvider } from "../../test/mocks/mock-provider.factory";
import { BoltRegisterService, EventType } from "./bolt-register.service";
import { BoltService } from "./bolt.service";
import { BOLT_ACTION_KEY } from "./decorators/bolt-action.decorator";

const discoveredActions = [
  {
    meta: "test action 1",
    discoveredMethod: {
      parentClass: { instance: 123 },
      methodName: "testmethod",
    },
  },
  {
    meta: "test action 2",
    discoveredMethod: {
      parentClass: { instance: 456 },
      methodName: "testmethod",
    },
  },
];

const discoveredEvents = [
  {
    meta: "test event 1",
    discoveredMethod: {
      parentClass: { instance: 789 },
      methodName: "testmethod",
    },
  },
];

describe("BoltRegisterService", () => {
  let boltRegisterService: BoltRegisterService;
  let boltService: BoltService;
  let bind: jest.Mock;

  beforeEach(async () => {
    bind = jest.fn();

    const app = await Test.createTestingModule({
      providers: [
        BoltRegisterService,
        createMockProvider(BoltService),
        createMockProvider(DiscoveryService, {
          controllerMethodsWithMetaAtKey: (et: EventType) =>
            et === BOLT_ACTION_KEY ? discoveredActions : discoveredEvents,
        }),
        createMockProvider(ModuleRef, {
          get: () => ({ testmethod: { bind } }),
        }),
      ],
    }).compile();

    boltRegisterService = app.get<BoltRegisterService>(BoltRegisterService);
    boltService = app.get<BoltService>(BoltService);
  });

  it("Registers actions", async () => {
    await boltRegisterService.registerAllHandlers();
    const bolt = boltService.getBolt();
    expect(bolt.action).toHaveBeenCalledTimes(2);
    expect(bolt.action).toHaveBeenCalledWith("test action 1", undefined);
    expect(bolt.action).toHaveBeenCalledWith("test action 2", undefined);
  });

  it("Registers events", async () => {
    await boltRegisterService.registerAllHandlers();
    const bolt = boltService.getBolt();
    expect(bolt.event).toHaveBeenCalledTimes(1);
    expect(bolt.event).toHaveBeenCalledWith("test event 1", undefined);
  });

  it("Binds handler functions to correct context", async () => {
    await boltRegisterService.registerAllHandlers();
    expect(bind).toHaveBeenCalledTimes(3);
    expect(bind).toHaveBeenCalledWith(123);
    expect(bind).toHaveBeenCalledWith(456);
    expect(bind).toHaveBeenCalledWith(789);
  });
});
