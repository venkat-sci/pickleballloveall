"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./data-source");
const user_1 = require("./routes/user");
const auth_1 = require("./routes/auth");
const tournament_1 = require("./routes/tournament");
const match_1 = require("./routes/match");
const player_1 = require("./routes/player");
const court_1 = require("./routes/court");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_1.authRouter);
app.use("/api/users", user_1.userRouter);
app.use("/api/tournaments", tournament_1.tournamentRouter);
app.use("/api/matches", match_1.matchRouter);
app.use("/api/players", player_1.playerRouter);
app.use("/api/courts", court_1.courtRouter);
const PORT = process.env.PORT || 3001;
data_source_1.AppDataSource.initialize()
    .then(() => {
    app.listen(PORT, () => { });
})
    .catch((error) => {
    console.error("Error during database connection:", error);
    process.exit(1);
});
