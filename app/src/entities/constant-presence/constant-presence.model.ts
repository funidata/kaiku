import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Office } from "../office/office.model";
import { User } from "../user/user.model";

@Entity()
export class ConstantPresence {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, { nullable: false, eager: true })
  @JoinColumn({ name: "user_slack_id" })
  user: User;

  // TODO: Add transformer.
  @Column({ name: "in_effect", type: "daterange", nullable: false })
  inEffect: string;

  @Column({ name: "day_of_week", type: "integer", nullable: false, unsigned: true })
  dayOfWeek: number;

  @Column({ name: "remote", type: "boolean", nullable: false, default: false })
  remote: boolean;

  @ManyToOne(() => Office, { nullable: true, eager: true })
  @JoinColumn({ name: "office_id" })
  office: Office | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
