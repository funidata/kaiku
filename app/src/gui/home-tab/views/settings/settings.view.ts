import { Injectable } from "@nestjs/common";
import { Actions, Button, Header, Input, Option, Section, StaticSelect } from "slack-block-builder";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";
import Action from "../../../../bolt/enums/action.enum";
import { Office } from "../../../../entities/office/office.model";
import { OfficeService } from "../../../../entities/office/office.service";
import { UserSettings } from "../../../../entities/user-settings/user-settings.model";
import { UserSettingsService } from "../../../../entities/user-settings/user-settings.service";

@Injectable()
export class SettingsView {
  constructor(
    private officeService: OfficeService,
    private userSettingsService: UserSettingsService,
  ) {}

  async build(userId: string): Promise<Appendable<ViewBlockBuilder>> {
    const offices = await this.officeService.findAll();
    const settings = await this.userSettingsService.findForUser(userId);

    return [
      Header({ text: "Asetukset" }),
      this.getHomeOfficeSelect(offices, settings),
      Actions().elements([
        Button({ text: "Toimistojen hallinta", actionId: Action.OPEN_OFFICE_MANAGEMENT_MODAL }),
      ]),
    ];
  }

  private getHomeOfficeSelect(offices: Office[], settings: UserSettings) {
    if (!offices) {
      return Section({
        text: "_Kotitoimiston valinta ei ole käytössä, koska Kaikuun ei ole vielä lisätty toimistoja._",
      });
    }

    const options = offices.map((office) => Option({ text: office.name, value: office.id }));
    const initialOption = options.find((opt) => opt["props"]["value"] === settings.homeOffice?.id);

    return Input({
      label: "Kotitoimisto",
      hint: "Ilmoittautumisesi merkitään oletusarvoisesti valitsemallesi kotitoimistolle. Toimistoa voi vaihtaa ilmoittauttumiskohtaisesti.",
    }).element(
      StaticSelect({ placeholder: "Valitse toimisto" })
        .options(options)
        .initialOption(initialOption),
    );
  }
}
