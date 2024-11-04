import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Repository } from "typeorm";
import { User } from "../user/user.model";

@Entity()
export class UserSettings {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User)
  user: User;

  /**
   * Office filter value.
   *
   * This is either `Office.id`, `"ALL_OFFICES"`, or `"REMOTE"`.
   */
  @Column({ type: "text", name: "office_filter", default: "ALL_OFFICES" })
  officeFilter: string;

  /**
   * Selected home tab view.
   */
  @Column({ type: "text", name: "selected_view", default: "registration" })
  selectedView: string;
}

export type UserSettingsRepository = Repository<UserSettings>;
