import { ConfigService } from "../../src/common/config/config.service";
import { createMockProvider } from "./mock-provider.factory";

export const ConfigServiceMock = createMockProvider(ConfigService);
