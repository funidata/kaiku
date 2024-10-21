import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, Repository } from "typeorm";
import { UserSettings } from "../user-settings/user-settings.model";

@Entity()
export class User {
  @PrimaryColumn({ type: "text" })
  slackId: string;

  @Column({ type: "text" })
  displayName: string;

  @Column({ type: "text" })
  realName: string;

  @OneToOne(() => UserSettings, { cascade: true, eager: true })
  @JoinColumn()
  settings: UserSettings;
}

export type UserRepository = Repository<User>;
