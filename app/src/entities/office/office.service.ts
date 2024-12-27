import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Office, OfficeRepository } from "./office.model";

@Injectable()
export class OfficeService {
  constructor(@InjectRepository(Office) private officeRepository: OfficeRepository) {}

  async findAll() {
    return this.officeRepository.find();
  }

  async findById(id: string) {
    return this.officeRepository.findOneBy({ id });
  }

  async create(name: string) {
    return this.officeRepository.save({ name });
  }

  async update(id: string, name: string) {
    return this.officeRepository.update({ id }, { name });
  }

  async delete(id: string) {
    return this.officeRepository.delete({ id });
  }
}
