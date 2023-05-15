require('dotenv').config()
const mysql = require('mysql2')
const utils = require('./utils')

function connect () {
  console.log(process.env.DATABASE_URL)
  const connection = mysql.createConnection(process.env.DATABASE_URL)
  console.log('Connected to PlanetScale!')
  return connection
}

const db = connect()

function getUserByEmail (email) {
  return new Promise((resolve, reject) => {
    db.execute('SELECT * FROM users WHERE email = ?', [email], (err, results, _) => {
      if (err) {
        reject(err)
      } else {
        resolve(results[0])
      }
    })
  })
}

async function updateUserById (id, updateData) {
  return new Promise((resolve, reject) => {
    db.execute('UPDATE users SET name = ?, password = ?, email = ? WHERE id = ?', [updateData.name, updateData.password, updateData.email, id], (err, results, _) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

async function updateTelephoneById (id, updateData) {
  return new Promise((resolve, reject) => {
    db.execute('UPDATE telephones SET number = ?, area_code = ? WHERE id = ?', [updateData.number, updateData.area_code, id], (err, results, _) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

async function deleteTelephoneById (id) {
  return new Promise((resolve, reject) => {
    db.execute('DELETE FROM telephones WHERE id = ?', [id], (err, results, _) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

function deleteUserById (id) {
  return new Promise((resolve, reject) => {
    db.execute('DELETE FROM users WHERE id = ?', [id], (err, results, _) => {
      if (err) {
        reject(err)
      } else {
        resolve(results[0])
      }
    })
  })
}

function getTelephonesByUserId (id) {
  return new Promise((resolve, reject) => {
    db.execute('SELECT * FROM telephones WHERE user_id = ?', [id], (err, results, _) => {
      if (err) {
        reject(err)
      } else {
        resolve(results[0])
      }
    })
  })
}

function getTelephonesById (id) {
  return new Promise((resolve, reject) => {
    db.execute('SELECT * FROM telephones WHERE id = ?', [id], (err, results, _) => {
      if (err) {
        reject(err)
      } else {
        resolve(results[0])
      }
    })
  })
}

async function createTelephone (userId, areaCode, number, name) {
  if (await userHasTelephone(userId, areaCode, number)) {
    return {
      code: 403,
      message: 'This user already has this phone number'
    }
  }
  const values = [userId, areaCode, number, name]
  const sql = 'INSERT INTO telephones (user_id, area_code, number, name) VALUES (?, ?, ?, ?)'
  db.execute(sql, values)
  const telephone = userHasTelephone(userId, areaCode, number)
  return telephone
}

async function userHasTelephone (userId, areaCode, number, name) {
  const values = [userId, areaCode, number]
  const sql = 'SELECT * FROM telephones WHERE user_id = ? AND area_code = ? AND number = ?'

  return new Promise((resolve, reject) => {
    db.execute(sql, values, (err, results, _) => {
      if (err) {
        reject(err)
      } else {
        resolve(results[0])
      }
    })
  })
}

async function createUser (name, email, hashPassword, telephones) {
  const values = [name, email, hashPassword]
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
  await db.execute(sql, values)
  const user = await getUserByEmail(email)
  if (telephones) {
    for (const i of telephones) {
      createTelephone(user.id, i.area_code, i.number, i.name)
    }
  }
  return user
}

async function loginUser (email, password) {
  const user = await getUserByEmail(email)
  const isCorretPassword = await utils.matchPassword(password, user.password)
  if (isCorretPassword) {
    return user
  }

  return {
    code: 401,
    message: 'Invalid credentials'
  }
}

module.exports = {
  connect,
  createUser,
  loginUser,
  getUserByEmail,
  getTelephonesByUserId,
  deleteUserById,
  updateUserById,
  getTelephonesById,
  updateTelephoneById,
  deleteTelephoneById,
  createTelephone,
  userHasTelephone
}
