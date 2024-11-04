import { Column, Entity, ManyToOne, PrimaryColumn, Repository } from "typeorm";
import { Office } from "../office/office.model";
import { User } from "../user/user.model";

export enum PresenceType {
  OFFICE = "office",
  REMOTE = "remote",
}

@Entity()
export class Presence {
  // TODO: Change to relation + add migration.
  @ManyToOne(() => User, { nullable: false })
  user: User;

  // Add user relation to table's composite primary key.
  @PrimaryColumn()
  userSlackId: string;

  @PrimaryColumn({ type: "date" })
  date: Date;

  @Column({ type: "enum", enum: PresenceType, nullable: true })
  type: PresenceType | null;

  @ManyToOne(() => Office, { nullable: true })
  office: Office | null;
}

export type PresenceRepository = Repository<Presence>;
