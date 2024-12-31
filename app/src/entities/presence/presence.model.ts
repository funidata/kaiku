import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Repository } from "typeorm";
import { Office } from "../office/office.model";
import { User } from "../user/user.model";

@Entity()
export class Presence {
  @ManyToOne(() => User, { nullable: false, eager: true })
  @JoinColumn({ name: "user_slack_id" })
  user: User;

  // Add user relation to table's composite primary key.
  @PrimaryColumn({ name: "user_slack_id" })
  userSlackId: string;

  @PrimaryColumn({ type: "date" })
  date: string;

  @Column({ name: "remote", type: "boolean", nullable: false, default: false })
  remote: boolean;

  @ManyToOne(() => Office, { nullable: true, eager: true })
  @JoinColumn({ name: "office_id" })
  office: Office | null;
}

export type PresenceRepository = Repository<Presence>;
