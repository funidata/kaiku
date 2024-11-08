import { Injectable } from "@nestjs/common";
import { DatePicker, Input } from "slack-block-builder";

@Injectable()
export class DateFilter {
  build(selectedDate?: string) {
    const initialDate = selectedDate ? new Date(selectedDate) : new Date();

    return [
      Input()
        .element(DatePicker().placeholder("Valitse alkupäivä").initialDate(initialDate))
        .label("Alkaen")
        .hint("Tiedot näytetään valitusta päivästä kaksi viikkoa eteenpäin."),
    ];
  }
}
