import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcryptjs";

export class SeedData1704534001000 implements MigrationInterface {
  name = "SeedData1704534001000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // No seeding performed
    return;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No data removal needed
    return;
  }
}
