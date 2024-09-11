import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOfficeTable1726033693575 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "office",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: "name",
            type: "text",
          },
        ],
      }),
    );
  }

  public async down(): Promise<void> {}
}
