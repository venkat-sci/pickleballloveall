import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Tournament } from "./entity/Tournament";
import { Match } from "./entity/Match";
import { TournamentParticipant } from "./entity/TournamentParticipant";
import { Court } from "./entity/Court";
import { Player } from "./entity/Player";

export const AppDataSource = new DataSource({
  type: "postgres",
  url:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USERNAME || "root"}:${
      process.env.DB_PASSWORD || "Password@123"
    }@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 5432}/${
      process.env.DB_DATABASE || "pickleballloveall"
    }`,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  entities: [User, Tournament, Match, TournamentParticipant, Court, Player],
  migrations:
    process.env.NODE_ENV === "production"
      ? ["dist/migrations/*.js"]
      : ["src/migrations/*.ts"],
  migrationsTableName: "migrations",
  migrationsRun: false, // Don't auto-run migrations, handle manually
  synchronize: process.env.NODE_ENV !== "production", // Only sync in development
  logging: process.env.NODE_ENV === "development",
});
