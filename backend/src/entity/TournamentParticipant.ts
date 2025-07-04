import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Tournament } from "./Tournament";

@Entity()
export class TournamentParticipant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "uuid" })
  tournamentId!: string;

  @ManyToOne(() => Tournament)
  @JoinColumn({ name: "tournamentId" })
  tournament!: Tournament;

  @Column({ nullable: true })
  partnerName?: string;

  // Tournament-specific stats
  @Column({ type: "int", default: 0 })
  tournamentWins!: number;

  @Column({ type: "int", default: 0 })
  tournamentLosses!: number;

  @Column({ type: "int", default: 0 })
  tournamentGamesPlayed!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
