import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerificationFields1704534002000
  implements MigrationInterface
{
  name = "AddEmailVerificationFields1704534002000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add columns only if they do not exist
    const columnsToAdd = [
      { name: "isEmailVerified", type: "boolean NOT NULL DEFAULT false" },
      { name: "emailVerificationToken", type: "character varying" },
      { name: "emailVerificationExpires", type: "TIMESTAMP" },
      { name: "passwordResetToken", type: "character varying" },
      { name: "passwordResetExpires", type: "TIMESTAMP" },
    ];
    for (const col of columnsToAdd) {
      const result = await queryRunner.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name='user' AND column_name='${col.name}'`
      );
      // If column does not exist, add it
      if (!Array.isArray(result) || result.length === 0) {
        await queryRunner.query(
          `ALTER TABLE "user" ADD COLUMN "${col.name}" ${col.type}`
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "passwordResetExpires"`
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "passwordResetToken"`
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "emailVerificationExpires"`
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "emailVerificationToken"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isEmailVerified"`);
  }
}
