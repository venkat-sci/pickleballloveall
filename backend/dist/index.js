"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const data_source_1 = require("./data-source");
const user_1 = require("./routes/user");
const auth_1 = require("./routes/auth");
const tournament_1 = require("./routes/tournament");
const match_1 = require("./routes/match");
const player_1 = require("./routes/player");
const court_1 = require("./routes/court");
const health_1 = require("./routes/health");
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(",") || [
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Serve uploaded files statically
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
// Health check endpoint (before other routes)
app.use("/", health_1.healthRouter);
// API routes
app.use("/api/auth", auth_1.authRouter);
app.use("/api/users", user_1.userRouter);
app.use("/api/tournaments", tournament_1.tournamentRouter);
app.use("/api/matches", match_1.matchRouter);
app.use("/api/players", player_1.playerRouter);
app.use("/api/courts", court_1.courtRouter);
const PORT = process.env.PORT || 3001;
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("✅ Database connected successfully");
    console.log(`🔄 Running in ${process.env.NODE_ENV || "development"} mode`);
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error("❌ Error during database connection:", error);
    process.exit(1);
});
// Export app for testing
exports.default = app;
