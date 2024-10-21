import { Column, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity()
export class UserSettings {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", default: "ALL_OFFICES" })
  officeFilter: string;
}

export type UserSettingsRepository = Repository<UserSettings>;
