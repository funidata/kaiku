import { Column, Entity, ManyToOne, PrimaryColumn, Repository } from "typeorm";
import { Office } from "../office/office.model";

export enum PresenceType {
  OFFICE = "office",
  REMOTE = "remote",
}

@Entity()
export class Presence {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn({ type: "date" })
  date: Date;

  @Column({ type: "enum", enum: PresenceType, nullable: true })
  type: PresenceType | null;

  @ManyToOne(() => Office, { nullable: true })
  office: Office | null;
}

export type PresenceRepository = Repository<Presence>;
