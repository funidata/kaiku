import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDateFilterUpdatedAtColumn1734678807520 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("user_settings");
    await queryRunner.addColumn(
      table,
      new TableColumn({ name: "date_filter_updated_at", type: "date", isNullable: true }),
    );
  }

  public async down(): Promise<void> {}
}
