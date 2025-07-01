import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
// import other entities...

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // set to false in production
  logging: false,
  entities: [User /*, ...other entities */],
  migrations: [],
  subscribers: [],
});
