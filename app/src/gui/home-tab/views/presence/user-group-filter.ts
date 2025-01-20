import { Injectable } from "@nestjs/common";
import { Input, Option, StaticSelect } from "slack-block-builder";
import { BoltService } from "../../../../bolt/bolt.service";
import Action from "../../../../bolt/enums/action.enum";

@Injectable()
export class UserGroupFilter {
  constructor(private boltService: BoltService) {}

  async build(selectedValue?: string) {
    const userGroups = await this.boltService.getUserGroups();

    const options = userGroups
      .toSorted((a, b) => (a.name || "").localeCompare(b.name || "", "fi", { sensitivity: "base" }))
      .map((ug) => ({
        text: ug.name,
        value: ug.handle,
      }));

    options.unshift({ text: "Kaikki ryhmät", value: "ALL_GROUPS" });
    const initialOption = options.find((opt) => opt.value === selectedValue) || options[0];

    return Input()
      .element(
        StaticSelect()
          .placeholder("Valitse ryhmä")
          .actionId(Action.SET_USER_GROUP_FILTER_VALUE)
          .initialOption(Option(initialOption))
          .options(options.map(Option)),
      )
      .label("Käyttäjäryhmä:")
      .dispatchAction(true);
  }
}
