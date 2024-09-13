import { Module } from "@nestjs/common";
import { DevUiBuilder } from "./dev-ui.builder";

@Module({ providers: [DevUiBuilder], exports: [DevUiBuilder] })
export class DevUiModule {}
