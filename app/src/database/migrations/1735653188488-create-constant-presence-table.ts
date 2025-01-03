import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddConstantPresenceTable1735653188488 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "constant_presence",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "user_slack_id",
            type: "text",
            isNullable: false,
          },
          {
            name: "in_effect",
            type: "daterange",
            isNullable: false,
          },
          {
            name: "day_of_week",
            type: "integer",
            isNullable: false,
            unsigned: true,
          },
          {
            name: "remote",
            type: "boolean",
            isNullable: false,
            default: false,
          },
          {
            name: "office_id",
            type: "uuid",
          },
          {
            name: "created_at",
            type: "timestamp",
            isNullable: false,
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            isNullable: false,
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["user_slack_id"],
            referencedTableName: "user",
            referencedColumnNames: ["slack_id"],
          },
          {
            columnNames: ["office_id"],
            referencedTableName: "office",
            referencedColumnNames: ["id"],
          },
        ],
      }),
    );

    // Default B-tree index is not effective with the daterange type.
    await queryRunner.query(
      "CREATE INDEX in_effect_index ON constant_presence USING GIST (in_effect)",
    );
  }

  public async down(): Promise<void> {}
}
