import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOfficeTable1726033693575 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "office",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
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
