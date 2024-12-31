import { Injectable } from "@nestjs/common";
import { BoltService } from "./bolt.service";
import { Member } from "./types/member.type";

@Injectable()
export class BoltUserService {
  constructor(private boltService: BoltService) {}

  async getUsers(): Promise<Member[]> {
    const userListResponse = await this.boltService.getBolt().client.users.list({});
    return userListResponse.members;
  }
}
