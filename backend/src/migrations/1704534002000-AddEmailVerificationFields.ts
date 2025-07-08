import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerificationFields1704534002000
  implements MigrationInterface
{
  name = "AddEmailVerificationFields1704534002000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add columns if they don't exist (PostgreSQL will throw an error if they do)
    // We'll catch and ignore the error if column already exists

    try {
      await queryRunner.query(
        `ALTER TABLE "user" ADD COLUMN "isEmailVerified" boolean NOT NULL DEFAULT false`
      );
    } catch (error: any) {
      if (!error.message.includes("already exists")) {
        throw error;
      }
    }

    try {
      await queryRunner.query(
        `ALTER TABLE "user" ADD COLUMN "emailVerificationToken" character varying`
      );
    } catch (error: any) {
      if (!error.message.includes("already exists")) {
        throw error;
      }
    }

    try {
      await queryRunner.query(
        `ALTER TABLE "user" ADD COLUMN "emailVerificationExpires" TIMESTAMP`
      );
    } catch (error: any) {
      if (!error.message.includes("already exists")) {
        throw error;
      }
    }

    try {
      await queryRunner.query(
        `ALTER TABLE "user" ADD COLUMN "passwordResetToken" character varying`
      );
    } catch (error: any) {
      if (!error.message.includes("already exists")) {
        throw error;
      }
    }

    try {
      await queryRunner.query(
        `ALTER TABLE "user" ADD COLUMN "passwordResetExpires" TIMESTAMP`
      );
    } catch (error: any) {
      if (!error.message.includes("already exists")) {
        throw error;
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
