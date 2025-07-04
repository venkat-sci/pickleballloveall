import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Tournament } from "./entity/Tournament";
import { Match } from "./entity/Match";
import { TournamentParticipant } from "./entity/TournamentParticipant";
import { Court } from "./entity/Court";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "Password@123",
  database: process.env.DB_DATABASE || "picklepro",
  synchronize: true, // set to false in production
  logging: false,
  entities: [User, Tournament, Match, TournamentParticipant, Court],
  migrations: [],
  subscribers: [],
});
