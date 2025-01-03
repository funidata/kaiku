import { ConstantPresence } from "../constant-presence.model";

export type CreateConstantPresence = Pick<ConstantPresence, "dayOfWeek" | "remote"> & {
  officeId: string | undefined;
};
