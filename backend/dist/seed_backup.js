"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const data_source_1 = require("./data-source");
const User_1 = require("./entity/User");
const Tournament_1 = require("./entity/Tournament");
const TournamentParticipant_1 = require("./entity/TournamentParticipant");
const Court_1 = require("./entity/Court");
const Match_1 = require("./entity/Match");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function seedData() {
    try {
        await data_source_1.AppDataSource.initialize();
        console.log("Database connection established for seeding.");
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const tournamentRepository = data_source_1.AppDataSource.getRepository(Tournament_1.Tournament);
        const tournamentParticipantRepository = data_source_1.AppDataSource.getRepository(TournamentParticipant_1.TournamentParticipant);
        const courtRepository = data_source_1.AppDataSource.getRepository(Court_1.Court);
        const matchRepository = data_source_1.AppDataSource.getRepository(Match_1.Match);
        // Clear existing data in correct order (child tables first)
        console.log("Clearing existing data...");
        // Delete all records using remove() instead of clear() to handle foreign keys
        const existingMatches = await matchRepository.find();
        if (existingMatches.length > 0) {
            await matchRepository.remove(existingMatches);
            console.log(`Removed ${existingMatches.length} existing matches`);
        }
        const existingParticipants = await tournamentParticipantRepository.find();
        if (existingParticipants.length > 0) {
            await tournamentParticipantRepository.remove(existingParticipants);
            console.log(`Removed ${existingParticipants.length} existing tournament participants`);
        }
        const existingCourts = await courtRepository.find();
        if (existingCourts.length > 0) {
            await courtRepository.remove(existingCourts);
            console.log(`Removed ${existingCourts.length} existing courts`);
        }
        const existingTournaments = await tournamentRepository.find();
        if (existingTournaments.length > 0) {
            await tournamentRepository.remove(existingTournaments);
            console.log(`Removed ${existingTournaments.length} existing tournaments`);
        }
        const existingUsers = await userRepository.find();
        if (existingUsers.length > 0) {
            await userRepository.remove(existingUsers);
            console.log(`Removed ${existingUsers.length} existing users`);
        }
        // Create users
        const hashedPassword = await bcryptjs_1.default.hash("password123", 12);
        const users = await userRepository.save([
            {
                email: "john.smith@example.com",
                password: hashedPassword,
                name: "John Smith",
                role: "organizer",
                rating: 4.2,
                totalWins: 15,
                totalLosses: 3,
                totalGamesPlayed: 18,
                profileImage: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
                phone: "+1-555-0001",
                location: "New York, NY",
                bio: "Tournament organizer with 10+ years of pickleball experience",
                dateOfBirth: new Date("1985-03-15"),
                preferredHand: "right",
                yearsPlaying: "10+",
                favoriteShot: "drive",
                notificationSettings: {
                    emailNotifications: true,
                    pushNotifications: true,
                    matchReminders: true,
                    tournamentUpdates: true,
                    scoreUpdates: false,
                    weeklyDigest: true,
                },
                privacySettings: {
                    profileVisibility: "public",
                    showRating: true,
                    showStats: true,
                    showLocation: true,
                    allowMessages: true,
                },
                preferences: {
                    theme: "light",
                    language: "en",
                    timezone: "America/New_York",
                    dateFormat: "MM/dd/yyyy",
                    timeFormat: "12h",
                },
                gameSettings: {
                    defaultTournamentType: "singles",
                    autoJoinWaitlist: true,
                    preferredCourtSurface: "outdoor",
                    availableDays: ["monday", "wednesday", "friday", "saturday"],
                    preferredTimeSlots: ["morning", "evening"],
                },
            },
            {
                email: "jane.smith@example.com",
                password: hashedPassword,
                name: "Sarah Wilson",
                role: "player",
                rating: 4.5,
                profileImage: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
                phone: "+1-555-0002",
                location: "Los Angeles, CA",
                bio: "Passionate pickleball player who loves doubles games",
                dateOfBirth: new Date("1990-07-22"),
                preferredHand: "left",
                yearsPlaying: "3",
                favoriteShot: "dink",
                notificationSettings: {
                    emailNotifications: true,
                    pushNotifications: false,
                    matchReminders: true,
                    tournamentUpdates: true,
                    scoreUpdates: true,
                    weeklyDigest: false,
                },
                privacySettings: {
                    profileVisibility: "players",
                    showRating: true,
                    showStats: false,
                    showLocation: false,
                    allowMessages: true,
                },
                preferences: {
                    theme: "dark",
                    language: "en",
                    timezone: "America/Los_Angeles",
                    dateFormat: "MM/dd/yyyy",
                    timeFormat: "12h",
                },
                gameSettings: {
                    defaultTournamentType: "doubles",
                    autoJoinWaitlist: false,
                    preferredCourtSurface: "both",
                    availableDays: ["tuesday", "thursday", "saturday", "sunday"],
                    preferredTimeSlots: ["afternoon", "evening"],
                },
            },
            {
                email: "mike.wilson@example.com",
                password: hashedPassword,
                name: "Mike Johnson",
                role: "player",
                rating: 4.0,
                profileImage: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
                phone: "+1-555-0003",
                location: "Chicago, IL",
                bio: "Competitive player focusing on singles tournaments",
                preferredHand: "right",
                yearsPlaying: "5",
                favoriteShot: "smash",
            },
            {
                email: "sarah.jones@example.com",
                password: hashedPassword,
                name: "Emma Davis",
                role: "player",
                rating: 4.1,
                profileImage: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150",
                phone: "+1-555-0004",
                location: "Austin, TX",
                bio: "New to pickleball but loving every game!",
                preferredHand: "right",
                yearsPlaying: "1",
                favoriteShot: "serve",
            },
            {
                email: "alex.brown@example.com",
                password: hashedPassword,
                name: "David Brown",
                role: "player",
                rating: 3.8,
                profileImage: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
                phone: "+1-555-0005",
                location: "Seattle, WA",
                bio: "Weekend warrior with a passion for the game",
                preferredHand: "ambidextrous",
                yearsPlaying: "4",
                favoriteShot: "drop",
            },
            {
                email: "lisa.davis@example.com",
                password: hashedPassword,
                name: "Lisa Garcia",
                role: "player",
                rating: 4.3,
                profileImage: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
                phone: "+1-555-0006",
                location: "Miami, FL",
                bio: "Former tennis player transitioning to pickleball",
                preferredHand: "right",
                yearsPlaying: "2",
                favoriteShot: "lob",
            },
            {
                email: "tom.miller@example.com",
                password: hashedPassword,
                name: "Alex Chen",
                role: "organizer",
                rating: 3.9,
                profileImage: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
                phone: "+1-555-0007",
                location: "Denver, CO",
                bio: "Event organizer and pickleball enthusiast",
                preferredHand: "right",
                yearsPlaying: "8",
                favoriteShot: "drive",
            },
            {
                email: "amy.taylor@example.com",
                password: hashedPassword,
                name: "Maria Rodriguez",
                role: "player",
                rating: 4.4,
                profileImage: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
                phone: "+1-555-0008",
                location: "Phoenix, AZ",
                bio: "Casual player who enjoys social games",
                preferredHand: "left",
                yearsPlaying: "2",
                favoriteShot: "dink",
            },
        ]);
        console.log("Created users:", users.length);
        // Create tournaments
        const tournament1 = tournamentRepository.create({
            name: "Summer Singles Championship",
            description: "Annual summer singles tournament for advanced players",
            type: "singles",
            format: "knockout",
            startDate: new Date("2025-08-15"),
            endDate: new Date("2025-08-17"),
            location: "Downtown Sports Complex",
            maxParticipants: 16,
            currentParticipants: 8,
            status: "upcoming",
            organizerId: users[0].id,
            entryFee: 25.0,
            prizePool: 400.0,
        });
        const tournament2 = tournamentRepository.create({
            name: "Doubles Fun Tournament",
            description: "Casual doubles tournament for all skill levels",
            type: "doubles",
            format: "round-robin",
            startDate: new Date("2025-07-20"),
            endDate: new Date("2025-07-21"),
            location: "City Park Courts",
            maxParticipants: 12,
            currentParticipants: 6,
            status: "upcoming",
            organizerId: users[6].id,
            entryFee: 15.0,
            prizePool: 180.0,
        });
        const tournament3 = tournamentRepository.create({
            name: "Mixed Doubles Mayhem",
            description: "Competitive mixed doubles tournament",
            type: "mixed",
            format: "swiss",
            startDate: new Date("2025-09-10"),
            endDate: new Date("2025-09-12"),
            location: "Riverside Recreation Center",
            maxParticipants: 20,
            currentParticipants: 12,
            status: "upcoming",
            organizerId: users[0].id,
            entryFee: 30.0,
            prizePool: 600.0,
        });
        const tournament4 = tournamentRepository.create({
            name: "Spring League Finals",
            description: "Final tournament of the spring league season",
            type: "singles",
            format: "knockout",
            startDate: new Date("2025-06-15"),
            endDate: new Date("2025-06-16"),
            location: "Athletic Club Courts",
            maxParticipants: 8,
            currentParticipants: 8,
            status: "completed",
            organizerId: users[6].id,
            entryFee: 20.0,
            prizePool: 160.0,
        });
        const tournaments = await tournamentRepository.save([
            tournament1,
            tournament2,
            tournament3,
            tournament4,
        ]);
        console.log("Created tournaments:", tournaments.length);
        // Create courts
        const courts = await courtRepository.save([
            {
                name: "Court 1",
                location: "Downtown Sports Complex",
                isAvailable: true,
                tournamentId: tournaments[0].id,
            },
            {
                name: "Court 2",
                location: "Downtown Sports Complex",
                isAvailable: true,
                tournamentId: tournaments[0].id,
            },
            {
                name: "Court A",
                location: "City Park Courts",
                isAvailable: true,
                tournamentId: tournaments[1].id,
            },
            {
                name: "Court B",
                location: "City Park Courts",
                isAvailable: true,
                tournamentId: tournaments[1].id,
            },
            {
                name: "Center Court",
                location: "Riverside Recreation Center",
                isAvailable: true,
                tournamentId: tournaments[2].id,
            },
            {
                name: "Side Court",
                location: "Riverside Recreation Center",
                isAvailable: true,
                tournamentId: tournaments[2].id,
            },
            {
                name: "Main Court",
                location: "Athletic Club Courts",
                isAvailable: true,
                tournamentId: tournaments[3].id,
            },
            {
                name: "Practice Court",
                location: "Athletic Club Courts",
                isAvailable: true,
            },
        ]);
        console.log("Created courts:", courts.length);
        // Create players for tournaments
        const playersData = [
            // Summer Singles Championship players
            {
                userId: users[1].id,
                name: users[1].name,
                rating: users[1].rating,
                tournamentId: tournaments[0].id,
            },
            {
                userId: users[2].id,
                name: users[2].name,
                rating: users[2].rating,
                tournamentId: tournaments[0].id,
            },
            {
                userId: users[3].id,
                name: users[3].name,
                rating: users[3].rating,
                tournamentId: tournaments[0].id,
            },
            {
                userId: users[4].id,
                name: users[4].name,
                rating: users[4].rating,
                tournamentId: tournaments[0].id,
            },
            {
                userId: users[5].id,
                name: users[5].name,
                rating: users[5].rating,
                tournamentId: tournaments[0].id,
            },
            {
                userId: users[7].id,
                name: users[7].name,
                rating: users[7].rating,
                tournamentId: tournaments[0].id,
            },
            // Doubles Fun Tournament players
            {
                userId: users[1].id,
                name: users[1].name,
                rating: users[1].rating,
                tournamentId: tournaments[1].id,
                partnerName: "Partner 1",
            },
            {
                userId: users[2].id,
                name: users[2].name,
                rating: users[2].rating,
                tournamentId: tournaments[1].id,
                partnerName: "Partner 2",
            },
            {
                userId: users[4].id,
                name: users[4].name,
                rating: users[4].rating,
                tournamentId: tournaments[1].id,
                partnerName: "Partner 3",
            },
            // Mixed Doubles Mayhem players
            {
                userId: users[1].id,
                name: users[1].name,
                rating: users[1].rating,
                tournamentId: tournaments[2].id,
                partnerName: "Mike Wilson",
            },
            {
                userId: users[3].id,
                name: users[3].name,
                rating: users[3].rating,
                tournamentId: tournaments[2].id,
                partnerName: "Alex Brown",
            },
            {
                userId: users[5].id,
                name: users[5].name,
                rating: users[5].rating,
                tournamentId: tournaments[2].id,
                partnerName: "Tom Miller",
            },
            // Spring League Finals players (completed tournament)
            {
                userId: users[1].id,
                name: users[1].name,
                rating: users[1].rating,
                wins: 3,
                losses: 1,
                gamesPlayed: 4,
                tournamentId: tournaments[3].id,
            },
            {
                userId: users[2].id,
                name: users[2].name,
                rating: users[2].rating,
                wins: 2,
                losses: 2,
                gamesPlayed: 4,
                tournamentId: tournaments[3].id,
            },
            {
                userId: users[3].id,
                name: users[3].name,
                rating: users[3].rating,
                wins: 1,
                losses: 3,
                gamesPlayed: 4,
                tournamentId: tournaments[3].id,
            },
            {
                userId: users[4].id,
                name: users[4].name,
                rating: users[4].rating,
                wins: 4,
                losses: 0,
                gamesPlayed: 4,
                tournamentId: tournaments[3].id,
            },
        ];
        const players = [];
        for (const playerData of playersData) {
            const player = playerRepository.create(playerData);
            players.push(await playerRepository.save(player));
        }
        console.log("Created players:", players.length);
        // Create general player profiles for all users with individual stats
        const generalPlayersData = [
            {
                userId: users[0].id, // John Smith
                name: users[0].name,
                rating: users[0].rating,
                wins: 15,
                losses: 3,
                gamesPlayed: 18,
                profileImage: users[0].profileImage,
            },
            {
                userId: users[1].id, // Sarah Wilson
                name: users[1].name,
                rating: users[1].rating,
                wins: 20,
                losses: 2,
                gamesPlayed: 22,
                profileImage: users[1].profileImage,
            },
            {
                userId: users[2].id, // Mike Johnson
                name: users[2].name,
                rating: users[2].rating,
                wins: 12,
                losses: 6,
                gamesPlayed: 18,
                profileImage: users[2].profileImage,
            },
            {
                userId: users[3].id, // Emma Davis
                name: users[3].name,
                rating: users[3].rating,
                wins: 14,
                losses: 8,
                gamesPlayed: 22,
                profileImage: users[3].profileImage,
            },
            {
                userId: users[4].id, // David Brown
                name: users[4].name,
                rating: users[4].rating,
                wins: 10,
                losses: 5,
                gamesPlayed: 15,
                profileImage: users[4].profileImage,
            },
            {
                userId: users[5].id, // Lisa Garcia
                name: users[5].name,
                rating: users[5].rating,
                wins: 18,
                losses: 4,
                gamesPlayed: 22,
                profileImage: users[5].profileImage,
            },
            {
                userId: users[6].id, // Alex Chen
                name: users[6].name,
                rating: users[6].rating,
                wins: 11,
                losses: 7,
                gamesPlayed: 18,
                profileImage: users[6].profileImage,
            },
            {
                userId: users[7].id, // Maria Rodriguez
                name: users[7].name,
                rating: users[7].rating,
                wins: 19,
                losses: 3,
                gamesPlayed: 22,
                profileImage: users[7].profileImage,
            },
        ];
        // Create general player profiles
        const generalPlayers = [];
        for (const playerData of generalPlayersData) {
            const existingPlayer = await playerRepository.findOne({
                where: { userId: playerData.userId, tournamentId: undefined },
            });
            if (!existingPlayer) {
                const player = playerRepository.create(playerData);
                generalPlayers.push(await playerRepository.save(player));
            }
        }
        console.log("Created general players:", generalPlayers.length);
        // Create some matches for the completed tournament
        const matches = await matchRepository.save([
            {
                tournamentId: tournaments[3].id,
                round: 1,
                player1Id: players[12].id, // Jane Smith
                player2Id: players[13].id, // Mike Wilson
                startTime: new Date("2025-06-15T09:00:00"),
                courtId: courts[6].id,
                status: "completed",
                score: { player1: [11, 8, 11], player2: [9, 11, 6] },
                winner: players[12].id,
            },
            {
                tournamentId: tournaments[3].id,
                round: 1,
                player1Id: players[14].id, // Sarah Jones
                player2Id: players[15].id, // Alex Brown
                startTime: new Date("2025-06-15T10:00:00"),
                courtId: courts[6].id,
                status: "completed",
                score: { player1: [7, 11, 9], player2: [11, 9, 11] },
                winner: players[15].id,
            },
            {
                tournamentId: tournaments[3].id,
                round: 2,
                player1Id: players[12].id, // Jane Smith
                player2Id: players[15].id, // Alex Brown
                startTime: new Date("2025-06-15T14:00:00"),
                courtId: courts[6].id,
                status: "completed",
                score: { player1: [9, 11, 8], player2: [11, 8, 11] },
                winner: players[15].id,
            },
            // Upcoming matches for Summer Singles Championship
            {
                tournamentId: tournaments[0].id,
                round: 1,
                player1Id: players[0].id, // Jane Smith
                player2Id: players[1].id, // Mike Wilson
                startTime: new Date("2025-08-15T09:00:00"),
                courtId: courts[0].id,
                status: "scheduled",
            },
            {
                tournamentId: tournaments[0].id,
                round: 1,
                player1Id: players[2].id, // Sarah Jones
                player2Id: players[3].id, // Alex Brown
                startTime: new Date("2025-08-15T10:00:00"),
                courtId: courts[1].id,
                status: "scheduled",
            },
        ]);
        console.log("Created matches:", matches.length);
        console.log("✅ Data seeding completed successfully!");
        console.log("\nSeeded data summary:");
        console.log(`- Users: ${users.length}`);
        console.log(`- Tournaments: ${tournaments.length}`);
        console.log(`- Courts: ${courts.length}`);
        console.log(`- Players: ${players.length}`);
        console.log(`- Matches: ${matches.length}`);
        console.log("\nTest credentials:");
        console.log("Organizer: john.doe@example.com / password123");
        console.log("Player: jane.smith@example.com / password123");
    }
    catch (error) {
        console.error("Error seeding data:", error);
    }
    finally {
        await data_source_1.AppDataSource.destroy();
    }
}
seedData();
