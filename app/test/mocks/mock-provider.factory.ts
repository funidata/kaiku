import { createMock, PartialFuncReturn } from "@golevelup/ts-jest";
import { FactoryProvider, InjectionToken } from "@nestjs/common";

/**
 * Create Nest.js-compatible mock provider from Class.
 *
 * Uses `@golevelup/ts-jest` to mock the given class. Optional `partial`
 * argument can be used to override mocked values.
 */
export const createMockProvider = <T extends object>(
  service: InjectionToken,
  partial?: PartialFuncReturn<T>,
): FactoryProvider<T> => ({
  provide: service,
  useFactory: () => createMock<T>(partial),
});
