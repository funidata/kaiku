import { Module } from "@nestjs/common";
import { BoltModule } from "./bolt/bolt.module";
import { ConfigModule } from "./common/config/config.module";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    BoltModule.register({
      appToken: process.env.SLACK_APP_TOKEN,
      token: process.env.SLACK_BOT_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
    }),
  ],
})
export class AppModule {}
