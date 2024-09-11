import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UpdateBasicInfoDto } from "./dto/user.dto";
import { User, UserRepository } from "./user.model";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: UserRepository) {}

  async findAll() {
    return this.userRepository.find();
  }

  async findPopulatedBySlackId(slackId: string): Promise<User> {
    return this.userRepository.findOne({
      where: { slackId },
      relations: { settings: true },
    });
  }

  /**
   * Create new user with default settings.
   */
  async create(user: User) {
    const res = await this.userRepository.save({
      ...user,
      settings: {},
    });
    return res;
  }

  async updateBasicInfoOrCreate(update: UpdateBasicInfoDto) {
    const user = await this.userRepository.findOneBy({
      slackId: update.slackId,
    });

    if (!user) {
      return this.create(update);
    }

    return this.userRepository.save(update);
  }
}
