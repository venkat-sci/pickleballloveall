import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity()
export class Match {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  tournamentId!: string;

  @ManyToOne("Tournament", "matches")
  @JoinColumn({ name: "tournamentId" })
  tournament!: any;

  @Column({ type: "int" })
  round!: number;

  @Column({ type: "uuid" })
  player1Id!: string;

  @ManyToOne("User", { eager: true })
  @JoinColumn({ name: "player1Id" })
  player1!: any;

  @Column({ type: "uuid" })
  player2Id!: string;

  @ManyToOne("User", { eager: true })
  @JoinColumn({ name: "player2Id" })
  player2!: any;

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

  @ManyToOne("Court", { eager: true })
  @JoinColumn({ name: "courtId" })
  court?: any;

  @Column({ type: "uuid", nullable: true })
  winner?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
