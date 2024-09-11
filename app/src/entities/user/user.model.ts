import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, Repository } from "typeorm";
import { UserSettings } from "../user-settings/user-settings.model";

@Entity()
export class User {
  @PrimaryColumn()
  slackId: string;

  @Column()
  displayName: string;

  @Column()
  realName: string;

  @OneToOne(() => UserSettings, { cascade: true })
  @JoinColumn({ name: "userSettingsId" })
  settings?: UserSettings;
}

export type UserRepository = Repository<User>;
