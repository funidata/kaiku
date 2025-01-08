import { SetMetadata } from "@nestjs/common";
import Action from "../enums/action.enum";

export const BOLT_ACTION_KEY = "BoltAction";

/**
 * Register decorated function as action.
 *
 * Acknowledgements (or "acks") are sent automatically when an action is
 * registered using this decorator.
 */
const BoltAction = (actionName: Action) => SetMetadata(BOLT_ACTION_KEY, actionName);

export default BoltAction;
