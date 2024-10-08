import { AllMiddlewareArgs, SlackEventMiddlewareArgs, UserProfileChangedEvent } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";

export type UserProfileChangedArgs = SlackEventMiddlewareArgs<UserProfileChangedEvent["type"]> &
  AllMiddlewareArgs<StringIndexed>;
