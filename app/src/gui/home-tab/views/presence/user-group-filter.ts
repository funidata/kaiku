import { Injectable } from "@nestjs/common";
import { Input, Option, StaticSelect } from "slack-block-builder";
import { BoltService } from "../../../../bolt/bolt.service";
import Action from "../../../../bolt/enums/action.enum";

@Injectable()
export class UserGroupFilter {
  constructor(private boltService: BoltService) {}

  async build(selectedValue?: string) {
    const userGroupRes = await this.boltService.getBolt().client.usergroups.list();
    const userGroups = userGroupRes.usergroups || [];

    const options = userGroups
      .toSorted((a, b) => a.name.localeCompare(b.name, "fi", { sensitivity: "base" }))
      .map((ug) => ({
        text: ug.name,
        value: ug.handle,
      }));

    const selectedOption = options.find((opt) => opt.value === selectedValue);
    const initialOption = selectedOption ? Option(selectedOption) : undefined;

    return Input()
      .element(
        StaticSelect()
          .placeholder("Valitse ryhmä")
          .actionId(Action.SET_USER_GROUP_FILTER_VALUE)
          .initialOption(initialOption)
          .options(options.map(Option)),
      )
      .label("Käyttäjäryhmä:")
      .dispatchAction(true);
  }
}
