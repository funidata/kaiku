import {
  AllMiddlewareArgs,
  BlockAction,
  SlackActionMiddlewareArgs,
  StringIndexed,
} from "@slack/bolt";

type VanillaBlockActionArgs = SlackActionMiddlewareArgs<BlockAction> &
  AllMiddlewareArgs<StringIndexed>;

/**
 * Arguments received by action handlers.
 *
 * Note that the `ack` method is removed to avoid duplicate acknowledgements
 * (our registration function sends acks automatically).
 */
export type BoltActionArgs = Omit<VanillaBlockActionArgs, "ack">;
