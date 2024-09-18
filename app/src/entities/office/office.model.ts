import { Column, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity()
export class Office {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  name: string;
}

export type OfficeRepository = Repository<Office>;
