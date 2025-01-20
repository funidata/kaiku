import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { CacheKey } from "../../common/cache-key.enum";
import { OfficeNotFoundException } from "../../common/exceptions/office-not-found.exception";
import { Office, OfficeRepository } from "./office.model";

@Injectable()
export class OfficeService {
  constructor(
    @InjectRepository(Office) private officeRepository: OfficeRepository,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  /**
   * Find all offices in database.
   *
   * This method is cached.
   */
  async findAll() {
    return this.cache.wrap(CacheKey.ALL_OFFICES, async () => this.officeRepository.find());
  }

  async findById(id: string) {
    const office = await this.officeRepository.findOneBy({ id });
    if (!office) {
      throw new OfficeNotFoundException();
    }
    return office;
  }

  async create(name: string) {
    await this.invalidateCache();
    return this.officeRepository.save({ name });
  }

  async update(id: string, name: string) {
    await this.invalidateCache();
    return this.officeRepository.update({ id }, { name });
  }

  async delete(id: string) {
    await this.invalidateCache();
    return this.officeRepository.delete({ id });
  }

  private async invalidateCache() {
    return this.cache.del(CacheKey.ALL_OFFICES);
  }
}
