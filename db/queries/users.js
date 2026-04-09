import bcrypt from "bcrypt";
import db from "#db/client";

export async function createUser(first_name, last_name, company, email, password) {
  const sql = `
    INSERT INTO users (first_name, last_name, company, email, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [first_name, last_name, company, email, hashedPassword]);
  return user;
}

export async function getUserByEmail(email) {
  const sql = `
    SELECT *
    FROM users
    WHERE email = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [email]);
  return user;
}

export async function getUserById(id) {
  const sql = `
    SELECT *
    FROM users
    WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}
