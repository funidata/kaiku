import { Global, Module } from "@nestjs/common";
import { HomeTabModule } from "./home-tab/home-tab.module";

/**
 * Global module avoids having to use forward references to resolve circular
 * dependencies as the builder classes often need to be back-referenced from
 * their dependencies to update views after actions.
 */
@Global()
@Module({
  imports: [HomeTabModule],
  exports: [HomeTabModule],
})
export class GuiModule {}
