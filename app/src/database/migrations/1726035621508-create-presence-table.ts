import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { PresenceType } from "../../entities/presence/presence.model";

export class CreatePresenceTable1726035621508 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "presence",
        columns: [
          {
            name: "user_id",
            type: "text",
            isPrimary: true,
          },
          {
            name: "date",
            type: "date",
            isPrimary: true,
          },
          {
            name: "type",
            type: "enum",
            enumName: "presence_type_enum",
            enum: Object.values(PresenceType),
            isNullable: true,
          },
          {
            name: "office_id",
            type: "int",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["office_id"],
            referencedTableName: "office",
            referencedColumnNames: ["id"],
          },
        ],
      }),
    );
  }

  public async down(): Promise<void> {}
}
