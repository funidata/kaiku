import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1726034817829 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          {
            name: "slack_id",
            type: "text",
            isPrimary: true,
          },
          {
            name: "display_name",
            type: "text",
          },
          {
            name: "real_name",
            type: "text",
          },
          {
            name: "settings_id",
            type: "uuid",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["settings_id"],
            referencedTableName: "user_settings",
            referencedColumnNames: ["id"],
            onDelete: "cascade",
            onUpdate: "cascade",
          },
        ],
      }),
    );
  }

  public async down(): Promise<void> {}
}
