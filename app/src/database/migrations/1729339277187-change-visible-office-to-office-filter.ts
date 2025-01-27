import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ChangeVisibleOfficeToOfficeFilter1729339277187 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("user_settings");
    if (!table) {
      throw new Error("Table not found during migration run.");
    }

    await queryRunner.dropForeignKeys(table, table.foreignKeys);
    await queryRunner.dropColumn(table, "visible_office_id");

    await queryRunner.addColumn(
      table,
      new TableColumn({ name: "office_filter", type: "text", default: "'ALL_OFFICES'::text" }),
    );
  }

  public async down(): Promise<void> {}
}
