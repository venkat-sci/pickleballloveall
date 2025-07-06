import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1704534000000 implements MigrationInterface {
  name = "InitialSchema1704534000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create users table
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "name" character varying NOT NULL,
                "role" character varying NOT NULL DEFAULT 'player',
                "rating" real NOT NULL DEFAULT '3',
                "profileImage" character varying,
                "totalWins" integer NOT NULL DEFAULT '0',
                "totalLosses" integer NOT NULL DEFAULT '0',
                "totalGamesPlayed" integer NOT NULL DEFAULT '0',
                "phone" character varying,
                "location" character varying,
                "bio" text,
                "dateOfBirth" date,
                "preferredHand" character varying NOT NULL DEFAULT 'right',
                "yearsPlaying" character varying,
                "favoriteShot" character varying,
                "notificationSettings" json,
                "privacySettings" json,
                "preferences" json,
                "gameSettings" json,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_user_email" UNIQUE ("email"),
                CONSTRAINT "PK_user" PRIMARY KEY ("id")
            )
        `);

    // Create court table
    await queryRunner.query(`
            CREATE TABLE "court" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "location" character varying,
                "surfaceType" character varying,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_court" PRIMARY KEY ("id")
            )
        `);

    // Create tournament table
    await queryRunner.query(`
            CREATE TABLE "tournament" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text,
                "startDate" TIMESTAMP,
                "endDate" TIMESTAMP,
                "registrationDeadline" TIMESTAMP,
                "maxParticipants" integer,
                "entryFee" numeric(10,2) DEFAULT '0',
                "status" character varying NOT NULL DEFAULT 'upcoming',
                "tournamentType" character varying NOT NULL DEFAULT 'singles',
                "bracketType" character varying NOT NULL DEFAULT 'single-elimination',
                "scoringFormat" character varying NOT NULL DEFAULT 'best-of-3',
                "location" character varying,
                "prizes" json,
                "rules" text,
                "equipmentProvided" json,
                "weatherPolicy" text,
                "contactInfo" json,
                "socialMediaLinks" json,
                "sponsorInfo" json,
                "registrationSettings" json,
                "advancedSettings" json,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "organizerId" uuid,
                CONSTRAINT "PK_tournament" PRIMARY KEY ("id")
            )
        `);

    // Create match table
    await queryRunner.query(`
            CREATE TABLE "match" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "startTime" TIMESTAMP,
                "status" character varying NOT NULL DEFAULT 'scheduled',
                "round" integer NOT NULL DEFAULT '1',
                "score" json,
                "notes" text,
                "authorizedScoreKeepers" text array,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "tournamentId" uuid,
                "player1Id" uuid,
                "player2Id" uuid,
                "courtId" uuid,
                CONSTRAINT "PK_match" PRIMARY KEY ("id")
            )
        `);

    // Create tournament_participant table
    await queryRunner.query(`
            CREATE TABLE "tournament_participant" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "registeredAt" TIMESTAMP NOT NULL DEFAULT now(),
                "status" character varying NOT NULL DEFAULT 'registered',
                "paymentStatus" character varying NOT NULL DEFAULT 'pending',
                "seed" integer,
                "tournamentId" uuid,
                "userId" uuid,
                CONSTRAINT "UQ_tournament_participant_tournament_user" UNIQUE ("tournamentId", "userId"),
                CONSTRAINT "PK_tournament_participant" PRIMARY KEY ("id")
            )
        `);

    // Add foreign key constraints
    await queryRunner.query(`
            ALTER TABLE "tournament" 
            ADD CONSTRAINT "FK_tournament_organizer" 
            FOREIGN KEY ("organizerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "match" 
            ADD CONSTRAINT "FK_match_tournament" 
            FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "match" 
            ADD CONSTRAINT "FK_match_player1" 
            FOREIGN KEY ("player1Id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "match" 
            ADD CONSTRAINT "FK_match_player2" 
            FOREIGN KEY ("player2Id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "match" 
            ADD CONSTRAINT "FK_match_court" 
            FOREIGN KEY ("courtId") REFERENCES "court"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "tournament_participant" 
            ADD CONSTRAINT "FK_tournament_participant_tournament" 
            FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "tournament_participant" 
            ADD CONSTRAINT "FK_tournament_participant_user" 
            FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    // Create indexes for performance
    await queryRunner.query(
      `CREATE INDEX "IDX_user_email" ON "user" ("email")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tournament_organizer" ON "tournament" ("organizerId")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tournament_status" ON "tournament" ("status")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tournament_start_date" ON "tournament" ("startDate")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_match_tournament" ON "match" ("tournamentId")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_match_players" ON "match" ("player1Id", "player2Id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_match_start_time" ON "match" ("startTime")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_match_status" ON "match" ("status")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tournament_participant_tournament" ON "tournament_participant" ("tournamentId")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tournament_participant_user" ON "tournament_participant" ("userId")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_tournament_participant_user"`);
    await queryRunner.query(
      `DROP INDEX "IDX_tournament_participant_tournament"`
    );
    await queryRunner.query(`DROP INDEX "IDX_match_status"`);
    await queryRunner.query(`DROP INDEX "IDX_match_start_time"`);
    await queryRunner.query(`DROP INDEX "IDX_match_players"`);
    await queryRunner.query(`DROP INDEX "IDX_match_tournament"`);
    await queryRunner.query(`DROP INDEX "IDX_tournament_start_date"`);
    await queryRunner.query(`DROP INDEX "IDX_tournament_status"`);
    await queryRunner.query(`DROP INDEX "IDX_tournament_organizer"`);
    await queryRunner.query(`DROP INDEX "IDX_user_email"`);

    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "tournament_participant" DROP CONSTRAINT "FK_tournament_participant_user"`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_participant" DROP CONSTRAINT "FK_tournament_participant_tournament"`
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_match_court"`
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_match_player2"`
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_match_player1"`
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_match_tournament"`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP CONSTRAINT "FK_tournament_organizer"`
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "tournament_participant"`);
    await queryRunner.query(`DROP TABLE "match"`);
    await queryRunner.query(`DROP TABLE "tournament"`);
    await queryRunner.query(`DROP TABLE "court"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
