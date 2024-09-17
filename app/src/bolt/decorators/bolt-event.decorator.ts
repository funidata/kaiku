import { SetMetadata } from "@nestjs/common";
import BoltEvents from "../enums/bolt-events.enum";

export const BOLT_EVENT_KEY = "BoltEvent";

const BoltEvent = (eventName: BoltEvents) => SetMetadata(BOLT_EVENT_KEY, eventName);

export default BoltEvent;
