import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,  // ✅ Render will provide this
  ssl: { rejectUnauthorized: false }, // ✅ important for Render
  synchronize: false,  // true only in dev, keep false for prod
  logging: true,
  entities: [__dirname + "/../**/*.entity.{ts,js}"], // adjust to your entities folder
  migrations: [__dirname + "/../migrations/*.{ts,js}"],
});
