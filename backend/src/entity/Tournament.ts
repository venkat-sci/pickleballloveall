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

  @OneToMany("Match", "tournament")
  matches!: any[];

  @OneToMany("Court", "tournament")
  courts!: any[];

  @OneToMany("Player", "tournament")
  participants!: any[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
