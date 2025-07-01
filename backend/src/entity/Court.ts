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

  @ManyToOne("Tournament", "courts")
  @JoinColumn({ name: "tournamentId" })
  tournament?: any;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
