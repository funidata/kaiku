import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class ChangePresenceUseridIntoRelation1730733451455 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("presence");
    await queryRunner.dropPrimaryKey(table, table.primaryColumns[0].name);
    await queryRunner.renameColumn(table, "user_id", "user_slack_id");
    await queryRunner.createForeignKey(
      table,
      new TableForeignKey({
        columnNames: ["user_slack_id"],
        referencedColumnNames: ["slack_id"],
        referencedTableName: "user",
      }),
    );
    await queryRunner.createPrimaryKey(table, ["user_slack_id", "date"]);
  }

  public async down(): Promise<void> {}
}
