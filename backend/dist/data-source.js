"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const Tournament_1 = require("./entity/Tournament");
const Match_1 = require("./entity/Match");
const TournamentParticipant_1 = require("./entity/TournamentParticipant");
const Court_1 = require("./entity/Court");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL ||
        `postgresql://${process.env.DB_USERNAME || "root"}:${process.env.DB_PASSWORD || "Password@123"}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 5432}/${process.env.DB_DATABASE || "pickleballloveall"}`,
    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
    entities: [User_1.User, Tournament_1.Tournament, Match_1.Match, TournamentParticipant_1.TournamentParticipant, Court_1.Court],
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "migrations",
    migrationsRun: process.env.NODE_ENV === "production", // Auto-run migrations in production
    synchronize: process.env.NODE_ENV !== "production", // Only sync in development
    logging: process.env.NODE_ENV === "development",
});
