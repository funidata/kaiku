import { AllMiddlewareArgs, BlockAction, SlackActionMiddlewareArgs } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";

export type BoltActionArgs = SlackActionMiddlewareArgs<BlockAction> &
  AllMiddlewareArgs<StringIndexed>;
