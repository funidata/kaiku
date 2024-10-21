import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { UserSettingsController } from "./user-settings.controller";
import { UserSettings } from "./user-settings.model";
import { UserSettingsService } from "./user-settings.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings]), UserModule],
  providers: [UserSettingsService],
  controllers: [UserSettingsController],
  exports: [TypeOrmModule, UserSettingsService],
})
export class UserSettingsModule {}
