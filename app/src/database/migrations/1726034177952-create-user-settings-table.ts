import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserSettingsTable1726034177952 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_settings",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: "visible_office_id",
            type: "int",
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
