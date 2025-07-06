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

@Entity()
export class Court {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ default: true })
  isAvailable!: boolean;

  @Column({ type: "uuid", nullable: true })
  tournamentId?: string;

  @ManyToOne(() => Tournament, { nullable: true })
  @JoinColumn({ name: "tournamentId" })
  tournament?: Tournament;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
