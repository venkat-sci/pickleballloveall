import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerificationFields1704534002000
  implements MigrationInterface
{
  name = "AddEmailVerificationFields1704534002000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isEmailVerified" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "emailVerificationToken" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "emailVerificationExpires" TIMESTAMP`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passwordResetToken" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passwordResetExpires" TIMESTAMP`
    );
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
