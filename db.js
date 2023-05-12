require('dotenv').config()
const mysql = require('mysql2')
const utils = require('./utils')

function connect() {
  const connection = mysql.createConnection(process.env.DATABASE_URL)
  console.log('Connected to PlanetScale!')
  return connection
}

const db = connect()

function getUser(email) {
    return new Promise((resolve, reject) => {
      db.execute('SELECT * FROM users WHERE email = ?', [email], (err, results, _) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
}

function getTelephonesByUserId(id) {
  return new Promise((resolve, reject) => {
    db.execute('SELECT * FROM telephones WHERE user_id = ?', [id], (err, results, _) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
}

async function createTelephone(userId, areaCode, number) {
    const values = [userId, areaCode, number];
  const sql = `INSERT INTO telephones (user_id, area_code, number) VALUES (?, ?, ?)`;
  try {
    await db.execute(sql, values);
  } catch {
    return {
      code: 400,
      message: "Cannot create this telephone"}
  }
    return {
      code: 200,
      message: "Telephone has been created"}
}

async function createUser(name, email, hashPassword, telephones) {
  const values = [name, email, hashPassword];
  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  await db.execute(sql, values);
  const user = await getUser(email)

  for (i of telephones) {
    createTelephone(user.id, i.area_code, i.number)
  }
  return user
}

async function loginUser(email, password){
    const user = await getUser(email);
    const isCorretPassword = await utils.matchPassword(password, user.password)
  if (isCorretPassword) {
      return user
  }
  return {
    code: 401,
    message: "Invalid credentials"}
}

module.exports = { 
    connect,
    createUser,
    loginUser,
    getUser,
}
