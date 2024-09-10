import { DiscoveryModule } from "@golevelup/nestjs-discovery";
import {
  Global,
  Module,
  OnApplicationBootstrap,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigModule } from "../common/config/config.module";
import { BoltRegisterService } from "./bolt-register.service";
import { BoltUserService } from "./bolt-user.service";
import { BoltService } from "./bolt.service";

@Global()
@Module({
  imports: [DiscoveryModule, ConfigModule],
  providers: [BoltService, BoltRegisterService, BoltUserService],
  exports: [BoltService, BoltUserService],
})
export class BoltModule implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy {
  constructor(
    private boltService: BoltService,
    private boltRegisterService: BoltRegisterService,
  ) {}

  async onModuleInit() {
    await this.boltService.connect();
  }

  async onApplicationBootstrap() {
    await this.boltRegisterService.registerAllHandlers();
  }

  async onModuleDestroy() {
    await this.boltService.disconnect();
  }
}
