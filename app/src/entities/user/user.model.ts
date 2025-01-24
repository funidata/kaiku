import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, Repository } from "typeorm";
import { UserSettings } from "../user-settings/user-settings.model";

@Entity()
export class User {
  @PrimaryColumn({ type: "text", name: "slack_id" })
  slackId: string;

  @Column({ type: "text", name: "display_name" })
  displayName: string;

  @Column({ type: "text", name: "real_name" })
  realName: string;

  @OneToOne(() => UserSettings, { cascade: true, eager: true })
  @JoinColumn({ name: "settings_id" })
  settings: UserSettings;
}

export type UserRepository = Repository<User>;
