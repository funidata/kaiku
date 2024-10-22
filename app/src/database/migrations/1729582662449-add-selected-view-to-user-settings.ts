import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSelectedViewToUserSettings1729582662449 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("user_settings");
    await queryRunner.addColumn(
      table,
      new TableColumn({ name: "selected_view", type: "text", default: "'registration'::text" }),
    );
  }

  public async down(): Promise<void> {}
}
