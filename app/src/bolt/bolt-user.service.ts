import { Injectable } from "@nestjs/common";
import { BoltService } from "./bolt.service";

@Injectable()
export class BoltUserService {
  constructor(private boltService: BoltService) {}

  async getUsers() {
    const userListResponse = await this.boltService.getBolt().client.users.list({});
    return userListResponse.members;
  }
}
