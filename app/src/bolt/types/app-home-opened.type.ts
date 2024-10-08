import { AllMiddlewareArgs, AppHomeOpenedEvent, SlackEventMiddlewareArgs } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";

export type AppHomeOpenedArgs = SlackEventMiddlewareArgs<AppHomeOpenedEvent["type"]> &
  AllMiddlewareArgs<StringIndexed>;
