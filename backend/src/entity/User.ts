import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string; // Not updatable after creation for security

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column({ default: "player" })
  role!: "player" | "organizer" | "viewer";

  @Column({ type: "float", default: 3.0 })
  rating!: number;

  @Column({ nullable: true })
  profileImage!: string;

  // Game statistics
  @Column({ type: "int", default: 0 })
  totalWins!: number;

  @Column({ type: "int", default: 0 })
  totalLosses!: number;

  @Column({ type: "int", default: 0 })
  totalGamesPlayed!: number;

  // Extended profile fields
  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  location!: string;

  @Column({ type: "text", nullable: true })
  bio!: string;

  @Column({ type: "date", nullable: true })
  dateOfBirth?: Date;

  @Column({ default: "right" })
  preferredHand!: "left" | "right" | "ambidextrous";

  @Column({ nullable: true })
  yearsPlaying!: string;

  @Column({ nullable: true })
  favoriteShot!: string;

  // Settings fields
  @Column({ type: "json", nullable: true })
  notificationSettings!: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    matchReminders?: boolean;
    tournamentUpdates?: boolean;
    scoreUpdates?: boolean;
    weeklyDigest?: boolean;
  };

  @Column({ type: "json", nullable: true })
  privacySettings!: {
    profileVisibility?: string;
    showRating?: boolean;
    showStats?: boolean;
    showLocation?: boolean;
    allowMessages?: boolean;
  };

  @Column({ type: "json", nullable: true })
  preferences!: {
    theme?: string;
    language?: string;
    timezone?: string;
    dateFormat?: string;
    timeFormat?: string;
  };

  @Column({ type: "json", nullable: true })
  gameSettings!: {
    defaultTournamentType?: string;
    autoJoinWaitlist?: boolean;
    preferredCourtSurface?: string;
    availableDays?: string[];
    preferredTimeSlots?: string[];
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
