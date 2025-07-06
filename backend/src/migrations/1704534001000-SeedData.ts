import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcryptjs";

export class SeedData1704534001000 implements MigrationInterface {
  name = "SeedData1704534001000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hash password for demo users
    const hashedPassword = await bcrypt.hash("demo123", 10);

    // Create demo users
    await queryRunner.query(`
            INSERT INTO "user" ("email", "name", "password", "role", "rating", "location", "bio") 
            VALUES 
            ('admin@pickleballloveall.com', 'Admin User', '${hashedPassword}', 'organizer', 4.5, 'Main Complex', 'Tournament organizer and pickleball enthusiast'),
            ('player1@example.com', 'John Doe', '${hashedPassword}', 'player', 3.5, 'North Side', 'Recreational player who loves doubles matches'),
            ('player2@example.com', 'Jane Smith', '${hashedPassword}', 'player', 4.0, 'South Side', 'Competitive player with 5 years experience'),
            ('player3@example.com', 'Mike Johnson', '${hashedPassword}', 'player', 3.8, 'East Side', 'Weekend warrior and pickleball coach'),
            ('organizer1@example.com', 'Sarah Wilson', '${hashedPassword}', 'organizer', 4.2, 'West Side', 'Event coordinator and former tennis pro')
        `);

    // Create sample courts
    await queryRunner.query(`
            INSERT INTO "court" ("name", "location", "surfaceType", "isActive") 
            VALUES 
            ('Court 1', 'Main Complex - North', 'Hard Court', true),
            ('Court 2', 'Main Complex - South', 'Hard Court', true),
            ('Court 3', 'East Wing', 'Clay Court', true),
            ('Court 4', 'West Wing', 'Composite', true),
            ('Court 5', 'Outdoor Arena', 'Concrete', true),
            ('Court 6', 'Indoor Arena', 'Cushioned', true)
        `);

    // Create a sample tournament
    const adminUserId = await queryRunner.query(
      `SELECT "id" FROM "user" WHERE "email" = 'admin@pickleballloveall.com' LIMIT 1`
    );
    const organizerId = adminUserId[0].id;

    await queryRunner.query(`
            INSERT INTO "tournament" ("name", "description", "startDate", "endDate", "registrationDeadline", "maxParticipants", "entryFee", "status", "tournamentType", "location", "organizerId") 
            VALUES 
            ('Spring Championship 2025', 'Annual spring tournament featuring both singles and doubles competitions', '2025-03-15 09:00:00', '2025-03-16 18:00:00', '2025-03-10 23:59:59', 32, 50.00, 'upcoming', 'singles', 'Main Complex', '${organizerId}'),
            ('Summer Open 2025', 'Open tournament for all skill levels', '2025-06-20 08:00:00', '2025-06-21 17:00:00', '2025-06-15 23:59:59', 64, 25.00, 'upcoming', 'doubles', 'Outdoor Arena', '${organizerId}')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove sample data in reverse order
    await queryRunner.query(
      `DELETE FROM "tournament" WHERE "name" IN ('Spring Championship 2025', 'Summer Open 2025')`
    );
    await queryRunner.query(`DELETE FROM "court" WHERE "name" LIKE 'Court %'`);
    await queryRunner.query(
      `DELETE FROM "user" WHERE "email" IN ('admin@pickleballloveall.com', 'player1@example.com', 'player2@example.com', 'player3@example.com', 'organizer1@example.com')`
    );
  }
}
