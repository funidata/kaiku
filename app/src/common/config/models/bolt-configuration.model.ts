import { IsString } from "class-validator";

/**
 * Configuration model for Slack's Bolt library.
 */
export class BoltConfiguration {
  @IsString()
  appToken = process.env.SLACK_APP_TOKEN;

  @IsString()
  token = process.env.SLACK_BOT_TOKEN;

  @IsString()
  signingSecret = process.env.SLACK_SIGNING_SECRET;
}
