import Event from "../enums/event.enum";
import BoltEvent, { BOLT_EVENT_KEY } from "./bolt-event.decorator";

describe("@BoltEvent", () => {
  class TestController {
    @BoltEvent(Event.APP_HOME_OPENED)
    public static appHomeOpened() {}

    @BoltEvent(Event.USER_PROFILE_CHANGED)
    public static userProfileChanged() {}
  }

  it("Assigns correct metadata to decorated class", () => {
    const metaValueForSync = Reflect.getMetadata(BOLT_EVENT_KEY, TestController.appHomeOpened);
    expect(metaValueForSync).toEqual(Event.APP_HOME_OPENED);

    const metaValueForSet = Reflect.getMetadata(BOLT_EVENT_KEY, TestController.userProfileChanged);
    expect(metaValueForSet).toEqual(Event.USER_PROFILE_CHANGED);
  });
});
