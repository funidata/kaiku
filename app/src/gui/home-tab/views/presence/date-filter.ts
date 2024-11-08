import { Injectable } from "@nestjs/common";
import { DatePicker, Input } from "slack-block-builder";

@Injectable()
export class DateFilter {
  build(initialDate?: Date) {
    return [
      Input()
        .element(DatePicker().placeholder("Valitse alkupäivä"))
        .label("Alkaen")
        .hint("Tiedot näytetään valitusta päivästä kaksi viikkoa eteenpäin."),
    ];
  }
}
