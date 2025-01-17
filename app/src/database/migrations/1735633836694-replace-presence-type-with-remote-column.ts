import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ReplacePresenceTypeWithRemoteColumn1735633836694 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * N.B.: Values are not migrated from `type` to `remote` because Kaiku is
     * not running anywhere yet and the default value of `remote`, while
     * sometimes incorrect, will not break anything.
     */
    const table = await queryRunner.getTable("presence");
    if (!table) {
      throw new Error("Table not found during migration run.");
    }

    await queryRunner.dropColumn(table, "type");

    await queryRunner.addColumn(
      table,
      new TableColumn({ name: "remote", type: "boolean", isNullable: false, default: false }),
    );
  }

  public async down(): Promise<void> {}
}
