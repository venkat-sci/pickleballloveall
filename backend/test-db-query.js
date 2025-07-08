const { Client } = require("pg");
require("dotenv").config();

async function queryUser() {
  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || "pickleball_tournament",
    user: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
  });

  try {
    await client.connect();
    const result = await client.query(
      'SELECT email, "isEmailVerified", "passwordResetToken", "emailVerificationToken" FROM "user" WHERE email = $1',
      ["newtest.dots.email@gmail.com"]
    );
    if (result.rows.length === 0) {
      console.log("No user found with that email");
    } else {
      console.log("User data:", result.rows[0]);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

queryUser();
