import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConstantPresence } from "./constant-presence.model";

@Module({ imports: [TypeOrmModule.forFeature([ConstantPresence])], exports: [TypeOrmModule] })
export class ConstantPresenceModule {}
