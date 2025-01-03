import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConstantPresence } from "./constant-presence.model";
import { ConstantPresenceService } from "./constant-presence.service";

@Module({
  imports: [TypeOrmModule.forFeature([ConstantPresence])],
  providers: [ConstantPresenceService],
  exports: [TypeOrmModule, ConstantPresenceService],
})
export class ConstantPresenceModule {}
