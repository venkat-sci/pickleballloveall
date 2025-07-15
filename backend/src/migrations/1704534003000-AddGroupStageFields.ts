import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroupStageFields1704534003000 implements MigrationInterface {
  name = "AddGroupStageFields1704534003000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add columns only if they do not exist
    const columnsToAdd = [
      { name: "numGroups", type: "integer DEFAULT 1" },
      { name: "knockoutEnabled", type: "boolean DEFAULT false" },
      { name: "advanceCount", type: "integer DEFAULT 1" },
    ];
    for (const col of columnsToAdd) {
      const result = await queryRunner.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name='tournament' AND column_name='${col.name}'`
      );
      if (!Array.isArray(result) || result.length === 0) {
        await queryRunner.query(
          `ALTER TABLE "tournament" ADD COLUMN "${col.name}" ${col.type}`
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "numGroups"`);
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP COLUMN "knockoutEnabled"`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP COLUMN "advanceCount"`
    );
  }
}
