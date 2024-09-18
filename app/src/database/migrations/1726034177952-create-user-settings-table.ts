import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserSettingsTable1726034177952 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_settings",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "visible_office_id",
            type: "uuid",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["visible_office_id"],
            referencedTableName: "office",
            referencedColumnNames: ["id"],
          },
        ],
      }),
    );
  }

  public async down(): Promise<void> {}
}
