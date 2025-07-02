"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const typeorm_1 = require("typeorm");
let Match = class Match {
};
exports.Match = Match;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Match.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Match.prototype, "tournamentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)("Tournament", "matches"),
    (0, typeorm_1.JoinColumn)({ name: "tournamentId" }),
    __metadata("design:type", Object)
], Match.prototype, "tournament", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Match.prototype, "round", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Match.prototype, "player1Id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)("Player", { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "player1Id" }),
    __metadata("design:type", Object)
], Match.prototype, "player1", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Match.prototype, "player2Id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)("Player", { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "player2Id" }),
    __metadata("design:type", Object)
], Match.prototype, "player2", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Object)
], Match.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "scheduled" }),
    __metadata("design:type", String)
], Match.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Match.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "courtId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)("Court", { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "courtId" }),
    __metadata("design:type", Object)
], Match.prototype, "court", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "winner", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Match.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Match.prototype, "updatedAt", void 0);
exports.Match = Match = __decorate([
    (0, typeorm_1.Entity)()
], Match);
