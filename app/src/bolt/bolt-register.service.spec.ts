import { DiscoveryService } from "@golevelup/nestjs-discovery";
import { ModuleRef } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { App } from "@slack/bolt";
import { createMockProvider } from "../../test/mocks/mock-provider.factory";
import { BoltRegisterService, EventType } from "./bolt-register.service";
import { BoltService } from "./bolt.service";
import { BOLT_ACTION_KEY } from "./decorators/bolt-action.decorator";
import { BOLT_EVENT_KEY } from "./decorators/bolt-event.decorator";
import { BOLT_VIEW_ACTION_KEY } from "./decorators/bolt-view-action.decorator";
import { BOLT_VIEW_CLOSE_ACTION_KEY } from "./decorators/bolt-view-close-action.decorator";

const discoveredActions = [
  {
    meta: "test action 1",
    discoveredMethod: {
      parentClass: { instance: 123, injectType: () => {} },
      methodName: "testmethod",
    },
  },
  {
    meta: "test action 2",
    discoveredMethod: {
      parentClass: { instance: 456, injectType: () => {} },
      methodName: "testmethod",
    },
  },
];

const discoveredEvents = [
  {
    meta: "test event 1",
    discoveredMethod: {
      parentClass: { instance: 789, injectType: () => {} },
      methodName: "testmethod",
    },
  },
];

const discoveredViewActions = [
  {
    meta: "test view action 1",
    discoveredMethod: {
      parentClass: { instance: 666, injectType: () => {} },
      methodName: "testmethod",
    },
  },
];

const discoveredViewCloseActions = [
  {
    meta: "test view close action 1",
    discoveredMethod: {
      parentClass: { instance: 9876, injectType: () => {} },
      methodName: "testmethod",
    },
  },
];

describe("BoltRegisterService", () => {
  let bolt: App;
  let bind: jest.Mock;

  beforeEach(async () => {
    bind = jest.fn();

    const app = await Test.createTestingModule({
      providers: [
        BoltRegisterService,
        createMockProvider(BoltService),
        createMockProvider(DiscoveryService, {
          controllerMethodsWithMetaAtKey: (et: EventType) => {
            if (et === BOLT_ACTION_KEY) {
              return discoveredActions;
            }
            if (et === BOLT_EVENT_KEY) {
              return discoveredEvents;
            }
            if (et === BOLT_VIEW_ACTION_KEY) {
              return discoveredViewActions;
            }
            if (et === BOLT_VIEW_CLOSE_ACTION_KEY) {
              return discoveredViewCloseActions;
            }
            return [];
          },
        }),
        createMockProvider(ModuleRef, {
          get: () => ({ testmethod: { bind } }),
        }),
      ],
    }).compile();

    await app.get<BoltRegisterService>(BoltRegisterService).registerAllHandlers();
    bolt = app.get<BoltService>(BoltService).getBolt();
  });

  it("Registers actions", async () => {
    expect(bolt.action).toHaveBeenCalledTimes(2);
    expect(bolt.action).toHaveBeenCalledWith("test action 1", expect.any(Function));
    expect(bolt.action).toHaveBeenCalledWith("test action 2", expect.any(Function));
  });

  it("Registers events", async () => {
    expect(bolt.event).toHaveBeenCalledTimes(1);
    expect(bolt.event).toHaveBeenCalledWith("test event 1", undefined);
  });

  it("Registers view actions", async () => {
    expect(bolt.view).toHaveBeenCalledTimes(2);
    expect(bolt.view).toHaveBeenCalledWith("test view action 1", expect.any(Function));
    expect(bolt.view).toHaveBeenCalledWith(
      { callback_id: "test view close action 1", type: "view_closed" },
      expect.any(Function),
    );
  });

  it("Binds handler functions to correct context", async () => {
    expect(bind).toHaveBeenCalledTimes(5);
    expect(bind).toHaveBeenCalledWith(123);
    expect(bind).toHaveBeenCalledWith(456);
    expect(bind).toHaveBeenCalledWith(789);
    expect(bind).toHaveBeenCalledWith(666);
    expect(bind).toHaveBeenCalledWith(9876);
  });
});
