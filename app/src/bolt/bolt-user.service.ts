import { Injectable } from "@nestjs/common";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import { BoltService } from "./bolt.service";

@Injectable()
export class BoltUserService {
  constructor(private boltService: BoltService) {}

  async getUsers(): Promise<Member[]> {
    const userListResponse = await this.boltService.getBolt().client.users.list({});
    return userListResponse.members;
  }
}
