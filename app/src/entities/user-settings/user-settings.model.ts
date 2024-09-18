import { Entity, ManyToOne, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Office } from "../office/office.model";

@Entity()
export class UserSettings {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Office, { eager: true })
  visibleOffice: Office;
}

export type UserSettingsRepository = Repository<UserSettings>;
