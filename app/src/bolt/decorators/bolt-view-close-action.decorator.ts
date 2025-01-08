import { SetMetadata } from "@nestjs/common";
import ViewCloseAction from "../enums/view-close-action.enum";

export const BOLT_VIEW_CLOSE_ACTION_KEY = "BoltViewClose";

/**
 * Register decorated function as view close notification handler.
 *
 * Acknowledgements (or "acks") are sent automatically when a function is
 * registered using this decorator.
 */
const BoltViewCloseAction = (callbackId: ViewCloseAction) =>
  SetMetadata(BOLT_VIEW_CLOSE_ACTION_KEY, callbackId);

export default BoltViewCloseAction;
