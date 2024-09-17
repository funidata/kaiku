import BoltActions from "../enums/bolt-actions.enum";
import BoltAction, { BOLT_ACTION_KEY } from "./bolt-action.decorator";

describe("@BoltAction", () => {
  class TestController {
    @BoltAction(BoltActions.SYNC_USERS)
    public static syncUsers() {}

    @BoltAction(BoltActions.SET_OFFICE_PRESENCE)
    public static setOfficePresence() {}
  }

  it("Assigns correct metadata to decorated class", () => {
    const metaValueForSync = Reflect.getMetadata(BOLT_ACTION_KEY, TestController.syncUsers);
    expect(metaValueForSync).toEqual(BoltActions.SYNC_USERS);

    const metaValueForSet = Reflect.getMetadata(BOLT_ACTION_KEY, TestController.setOfficePresence);
    expect(metaValueForSet).toEqual(BoltActions.SET_OFFICE_PRESENCE);
  });
});
