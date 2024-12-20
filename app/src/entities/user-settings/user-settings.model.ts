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

  @Column({ type: "date", name: "date_filter", nullable: true })
  dateFilter: string;

  @Column({ type: "date", name: "date_filter_updated_at", nullable: true })
  dateFilterUpdatedAt: string;

  /**
   * Selected user group.
   */
  @Column({ type: "text", name: "user_group_filter", nullable: true })
  userGroupFilter: string;

  /**
   * Selected home tab view.
   */
  @Column({ type: "text", name: "selected_view", default: "registration" })
  selectedView: string;
}

export type UserSettingsRepository = Repository<UserSettings>;
