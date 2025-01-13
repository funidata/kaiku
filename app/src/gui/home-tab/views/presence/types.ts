import { Dayjs } from "dayjs";
import { ConstantPresence } from "../../../../entities/constant-presence/constant-presence.model";
import { Presence } from "../../../../entities/presence/presence.model";

export type CommonPresence = Pick<Presence, keyof (Presence | ConstantPresence)>;

export type PresencesByDate = {
  date: Dayjs;
  presences: CommonPresence[];
};
