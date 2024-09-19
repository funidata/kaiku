import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

(async () => {
  const app = await NestFactory.createMicroservice(AppModule, { bufferLogs: true });
  app.enableShutdownHooks();
  await app.listen();
})();
