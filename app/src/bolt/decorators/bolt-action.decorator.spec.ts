import Action from "../enums/action.enum";
import BoltAction, { BOLT_ACTION_KEY } from "./bolt-action.decorator";

describe("@BoltAction", () => {
  class TestController {
    @BoltAction(Action.SYNC_USERS)
    public static syncUsers() {}

    @BoltAction(Action.SET_OFFICE_PRESENCE)
    public static setOfficePresence() {}
  }

  it("Assigns correct metadata to decorated class", () => {
    const metaValueForSync = Reflect.getMetadata(BOLT_ACTION_KEY, TestController.syncUsers);
    expect(metaValueForSync).toEqual(Action.SYNC_USERS);

    const metaValueForSet = Reflect.getMetadata(BOLT_ACTION_KEY, TestController.setOfficePresence);
    expect(metaValueForSet).toEqual(Action.SET_OFFICE_PRESENCE);
  });
});
