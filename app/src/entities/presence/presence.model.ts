import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Repository } from "typeorm";
import { Office } from "../office/office.model";
import { User } from "../user/user.model";

export enum PresenceType {
  OFFICE = "office",
  REMOTE = "remote",
}

@Entity()
export class Presence {
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_slack_id" })
  user: User;

  // Add user relation to table's composite primary key.
  @PrimaryColumn({ name: "user_slack_id" })
  userSlackId: string;

  @PrimaryColumn({ type: "date" })
  date: Date;

  @Column({ type: "enum", enum: PresenceType, nullable: true })
  type: PresenceType | null;

  @ManyToOne(() => Office, { nullable: true })
  @JoinColumn({ name: "office_id" })
  office: Office | null;
}

export type PresenceRepository = Repository<Presence>;
