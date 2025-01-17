import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserNotFoundException } from "../../common/exceptions/user-not-found.exception";
import { UpdateBasicInfoDto } from "./dto/user.dto";
import { User, UserRepository } from "./user.model";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: UserRepository) {}

  async findAll() {
    return this.userRepository.find();
  }

  async findPopulatedBySlackId(slackId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { slackId },
      relations: { settings: true },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  /**
   * Create new user with default settings.
   */
  async create(user: Omit<User, "settings">) {
    const res = await this.userRepository.save({
      ...user,
      // Empty settings object here results in TypeORM applying default values to it.
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
