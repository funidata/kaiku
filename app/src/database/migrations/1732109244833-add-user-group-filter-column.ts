import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUserGroupFilterColumn1732109244833 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("user_settings");
    if (!table) {
      throw new Error("Table not found during migration run.");
    }

    await queryRunner.addColumn(
      table,
      new TableColumn({ name: "user_group_filter", type: "text", isNullable: true }),
    );
  }

  public async down(): Promise<void> {}
}
