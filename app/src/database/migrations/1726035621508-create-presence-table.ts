import { MigrationInterface, QueryRunner, Table } from "typeorm";

// Moved here after the (imported) enum was removed from code.
enum PresenceType {
  OFFICE = "office",
  REMOTE = "remote",
}

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
            type: "uuid",
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
