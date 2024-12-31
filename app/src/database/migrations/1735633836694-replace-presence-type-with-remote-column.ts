import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ReplacePresenceTypeWithRemoteColumn1735633836694 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("presence");

    await queryRunner.dropColumn(table, "type");

    await queryRunner.addColumn(
      table,
      new TableColumn({ name: "remote", type: "boolean", isNullable: false, default: false }),
    );
  }

  public async down(): Promise<void> {}
}
