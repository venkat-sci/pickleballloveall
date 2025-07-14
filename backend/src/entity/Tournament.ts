import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Match } from "./Match";
import { Court } from "./Court";
import { TournamentParticipant } from "./TournamentParticipant";

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column()
  type!: "singles" | "doubles" | "mixed";

  @Column()
  format!: "round-robin" | "knockout" | "swiss";

  @Column({ type: "timestamp" })
  startDate!: Date;

  @Column({ type: "timestamp" })
  endDate!: Date;

  @Column()
  location!: string;

  @Column({ type: "int" })
  maxParticipants!: number;

  @Column({ type: "int", default: 0 })
  currentParticipants!: number;

  @Column({ default: "upcoming" })
  status!: "upcoming" | "ongoing" | "completed";

  @Column({ type: "uuid" })
  organizerId!: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "organizerId" })
  organizer!: User;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  entryFee?: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  prizePool?: number;

  // Category differentiation: Men, Women, Kids
  @Column({ type: "varchar", default: "men" })
  category!: "men" | "women" | "kids";

  @Column({ type: "text", nullable: true })
  rules?: string;

  // Winner information
  @Column({ type: "uuid", nullable: true })
  winnerId?: string;

  @Column({ type: "varchar", nullable: true })
  winnerName?: string;

  @Column({ type: "varchar", nullable: true })
  winnerPartner?: string; // For doubles tournaments

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "winnerId" })
  winner?: User;

  @OneToMany(() => Match, (match) => match.tournament)
  matches!: Match[];

  @OneToMany(() => Court, (court) => court.tournament)
  courts!: Court[];

  @OneToMany(
    () => TournamentParticipant,
    (participant) => participant.tournament
  )
  participants!: TournamentParticipant[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
