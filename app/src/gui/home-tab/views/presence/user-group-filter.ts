import { Injectable } from "@nestjs/common";
import { Input, Option, StaticSelect } from "slack-block-builder";
import { BoltService } from "../../../../bolt/bolt.service";

@Injectable()
export class UserGroupFilter {
  constructor(private boltService: BoltService) {}

  async build() {
    const userGroupRes = await this.boltService.getBolt().client.usergroups.list();
    const userGroups = userGroupRes.usergroups || [];

    const options = userGroups
      .toSorted((a, b) => a.name.localeCompare(b.name, "fi", { sensitivity: "base" }))
      .map((ug) => ({
        text: ug.name,
        value: ug.handle,
      }));

    return [
      Input()
        .element(StaticSelect().placeholder("Valitse ryhmä").options(options.map(Option)))
        .label("Käyttäjäryhmä:")
        .dispatchAction(true),
    ];
  }
}
