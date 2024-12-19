import {
  AllMiddlewareArgs,
  BlockAction,
  SlackActionMiddlewareArgs,
  StringIndexed,
} from "@slack/bolt";

export type BoltActionArgs = SlackActionMiddlewareArgs<BlockAction> &
  AllMiddlewareArgs<StringIndexed>;
