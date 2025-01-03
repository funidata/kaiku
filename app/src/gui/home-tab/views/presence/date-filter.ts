import { Injectable } from "@nestjs/common";
import { DatePicker, Input } from "slack-block-builder";
import Action from "../../../../bolt/enums/action.enum";

@Injectable()
export class DateFilter {
  build(selectedDate?: string) {
    const initialDate = selectedDate ? new Date(selectedDate) : new Date();

    return Input()
      .element(
        DatePicker()
          .placeholder("Valitse alkupäivä")
          .initialDate(initialDate)
          .actionId(Action.SET_DATE_FILTER_VALUE),
      )
      .label("Alkaen")
      .hint("Tiedot näytetään valitusta päivästä kaksi viikkoa eteenpäin.")
      .dispatchAction(true);
  }
}
