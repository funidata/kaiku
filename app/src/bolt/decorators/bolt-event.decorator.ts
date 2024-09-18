import { SetMetadata } from "@nestjs/common";
import Event from "../enums/event.enum";

export const BOLT_EVENT_KEY = "BoltEvent";

const BoltEvent = (eventName: Event) => SetMetadata(BOLT_EVENT_KEY, eventName);

export default BoltEvent;
