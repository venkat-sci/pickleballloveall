import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Tournament } from "./Tournament";
import { User } from "./User";
import { Court } from "./Court";

@Entity()
export class Match {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  tournamentId!: string;

  @ManyToOne(() => Tournament)
  @JoinColumn({ name: "tournamentId" })
  tournament!: Tournament;

  @Column({ type: "int" })
  round!: number;

  @Column({ type: "uuid" })
  player1Id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "player1Id" })
  player1!: User;

  @Column({ type: "uuid" })
  player2Id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "player2Id" })
  player2!: User;

  @Column({ type: "json", nullable: true })
  score?: {
    player1: number[];
    player2: number[];
  };

  @Column({ default: "scheduled" })
  status!: "scheduled" | "in-progress" | "completed";

  @Column({ type: "timestamp" })
  startTime!: Date;

  @Column({ type: "uuid", nullable: true })
  courtId?: string;

  @ManyToOne(() => Court, { nullable: true })
  @JoinColumn({ name: "courtId" })
  court?: Court;

  @Column({ type: "uuid", nullable: true })
  winner?: string;

  @Column({ type: "json", nullable: true })
  authorizedScoreKeepers?: string[]; // Array of user IDs who can update scores

  @Column({ type: "boolean", default: false })
  canStartEarly!: boolean; // Flag to allow early start

  @Column({ type: "timestamp", nullable: true })
  actualStartTime?: Date; // When the match actually started (vs scheduled time)

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
