import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUserGroupFilterColumn1732109244833 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("user_settings");
    await queryRunner.addColumn(
      table,
      new TableColumn({ name: "date_filter", type: "text", isNullable: true }),
    );
  }

  public async down(): Promise<void> {}
}
