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

@Entity()
export class Player {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  name!: string;

  @Column({ type: "float", default: 0 })
  rating!: number;

  @Column({ type: "int", default: 0 })
  wins!: number;

  @Column({ type: "int", default: 0 })
  losses!: number;

  @Column({ type: "int", default: 0 })
  gamesPlayed!: number;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ nullable: true })
  partnerName?: string;

  @Column({ type: "uuid", nullable: true })
  tournamentId?: string;

  @ManyToOne("Tournament", "participants")
  @JoinColumn({ name: "tournamentId" })
  tournament?: any;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
