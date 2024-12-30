import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddHomeOfficeColumnToUserSettings1735539215842 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("user_settings");

    await queryRunner.addColumn(
      table,
      new TableColumn({ name: "home_office_id", type: "uuid", isNullable: true }),
    );

    await queryRunner.createForeignKey(
      table,
      new TableForeignKey({
        columnNames: ["home_office_id"],
        referencedTableName: "office",
        referencedColumnNames: ["id"],
      }),
    );
  }

  public async down(): Promise<void> {}
}
