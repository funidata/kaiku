import { Column, Entity, OneToOne, PrimaryColumn, Repository } from "typeorm";
import { UserSettings } from "../user-settings/user-settings.model";

@Entity()
export class User {
  @PrimaryColumn({ type: "text" })
  slackId: string;

  @Column({ type: "text" })
  displayName: string;

  @Column({ type: "text" })
  realName: string;

  @OneToOne(() => UserSettings, { cascade: true })
  settings?: UserSettings;
}

export type UserRepository = Repository<User>;
