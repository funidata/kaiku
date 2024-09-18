import { SetMetadata } from "@nestjs/common";
import Action from "../enums/action.enum";

export const BOLT_ACTION_KEY = "BoltAction";

const BoltAction = (actionName: Action) => SetMetadata(BOLT_ACTION_KEY, actionName);

export default BoltAction;
