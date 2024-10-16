import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";

type ViewOptions = {
  selectedView: "registration" | "presence" | "settings";
};

const defaultOptions: ViewOptions = {
  selectedView: "registration",
};

/**
 * View caching service implements lightweight non-persistent storage for view
 * selections. This data includes things like selected view, selected drop-down
 * values, etc. Basically anything that is nice to store for a better UX but
 * isn't something that needs to be persisted in the database.
 *
 * Note that while partial updates to the cached view objects are fine, nested
 * structures will be overwritten by the current implementation.
 */
@Injectable()
export class ViewCache {
  private logger = new Logger(ViewCache.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(userId: string): Promise<ViewOptions> {
    const cached = await this.getCachedValue(userId);

    if (cached) {
      this.logger.debug(`View cache hit for user ${userId}`, cached);
    }

    return { ...defaultOptions, ...cached };
  }

  async set(userId: string, value: Partial<ViewOptions>): Promise<void> {
    const cached = await this.getCachedValue(userId);
    // Note that this will break for nested objects.
    const merged = { ...cached, ...value };
    await this.cacheManager.set(this.cacheKey(userId), merged);
    return;
  }

  private cacheKey(userId: string): string {
    return `view-cache-${userId}`;
  }

  private getCachedValue(userId: string): Promise<Partial<ViewOptions>> {
    return this.cacheManager.get<Partial<ViewOptions>>(this.cacheKey(userId));
  }
}
