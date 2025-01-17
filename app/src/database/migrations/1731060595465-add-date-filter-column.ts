import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDateFilterColumn1731060595465 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("user_settings");
    if (!table) {
      throw new Error("Table not found during migration run.");
    }

    await queryRunner.addColumn(
      table,
      new TableColumn({ name: "date_filter", type: "date", isNullable: true }),
    );
  }

  public async down(): Promise<void> {}
}
