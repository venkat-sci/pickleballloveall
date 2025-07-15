import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTournamentDateFields1704534004000
  implements MigrationInterface
{
  name = "ChangeTournamentDateFields1704534004000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Only alter columns if they exist
    const columns = ["startDate", "endDate"];
    for (const col of columns) {
      const result = await queryRunner.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name='tournament' AND column_name='${col}'`
      );
      if (Array.isArray(result) && result.length > 0) {
        if (col === "startDate") {
          await queryRunner.query(
            `ALTER TABLE "tournament" ALTER COLUMN "startDate" TYPE date USING "startDate"::date`
          );
        } else if (col === "endDate") {
          await queryRunner.query(
            `ALTER TABLE "tournament" ALTER COLUMN "endDate" TYPE date USING "endDate"::date`
          );
          await queryRunner.query(
            `ALTER TABLE "tournament" ALTER COLUMN "endDate" DROP NOT NULL`
          );
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournament" ALTER COLUMN "startDate" TYPE timestamp USING startDate::timestamp`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament" ALTER COLUMN "endDate" TYPE timestamp USING endDate::timestamp`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament" ALTER COLUMN "endDate" SET NOT NULL`
    );
  }
}
