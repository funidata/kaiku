import { SetMetadata } from "@nestjs/common";
import BoltActions from "../enums/bolt-actions.enum";

export const BOLT_ACTION_KEY = "BoltAction";

const BoltAction = (actionName: BoltActions) => SetMetadata(BOLT_ACTION_KEY, actionName);

export default BoltAction;
