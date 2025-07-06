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
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "Password@123",
    database: process.env.DB_DATABASE || "pickleballloveall",
    synchronize: true, // set to false in production
    logging: false,
    entities: [User_1.User, Tournament_1.Tournament, Match_1.Match, TournamentParticipant_1.TournamentParticipant, Court_1.Court],
    migrations: [],
    subscribers: [],
});
