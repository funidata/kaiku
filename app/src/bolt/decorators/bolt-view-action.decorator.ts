import { SetMetadata } from "@nestjs/common";
import ViewAction from "../enums/view-action.enum";

export const BOLT_VIEW_ACTION_KEY = "BoltSubmission";

/**
 * Register decorated function as view submission handler.
 *
 * Acknowledgements (or "acks") are sent automatically when a function is
 * registered using this decorator.
 */
const BoltViewAction = (callbackId: ViewAction) => SetMetadata(BOLT_VIEW_ACTION_KEY, callbackId);

export default BoltViewAction;
