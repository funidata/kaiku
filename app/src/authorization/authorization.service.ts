import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { BoltService } from "../bolt/bolt.service";
import { UserNotFoundException } from "../common/exceptions/user-not-found.exception";

@Injectable()
export class AuthorizationService {
  logger = new Logger(AuthorizationService.name);

  constructor(private boltService: BoltService) {}

  async requireOwnerRole(userId: string): Promise<void> {
    const bolt = this.boltService.getBolt();
    const { user } = await bolt.client.users.info({ user: userId });

    if (!user) {
      throw new UserNotFoundException();
    }

    if (!user.is_owner) {
      this.logger.warn(
        `User ${userId} tried to access a protected resource requiring workspace owner privileges.`,
      );
      throw new UnauthorizedException();
    }
  }
}
