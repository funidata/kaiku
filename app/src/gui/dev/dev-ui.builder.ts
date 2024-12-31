import { Injectable } from "@nestjs/common";
import { Actions, Button, Context, Divider, Header } from "slack-block-builder";
import Action from "../../bolt/enums/action.enum";

@Injectable()
export class DevUiBuilder {
  build() {
    return [
      Header({ text: ":wrench:  Developer Tools" }),
      Actions().elements(
        Button({
          text: ":recycle:  Sync Users",
          actionId: Action.SYNC_USERS,
        }),
        Button({ text: ":put_litter_in_its_place:  Clear DB", actionId: Action.CLEAR_DATABASE }),
      ),
      Context().elements(
        "In development environment, users are not synchronized between local database and Slack on app start to avoid running into API rate limits due to hot-reloads. Sync users manually when necessary.",
      ),
      Divider(),
    ];
  }
}
