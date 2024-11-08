import { PresenceType } from "../presence.model";

export type PresenceFilter = {
  date?: string;
  startDate?: string;
  endDate?: string;
  officeId?: string;
  type?: PresenceType;
};
