const bcrypt = require('bcryptjs');

function encryptPassword(password){
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function(err, hash) {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
    });
}

async function matchPassword(password, userPassword){
    return await bcrypt.compare(password, userPassword)
}

function validatePassword(password) {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

  return regex.test(password);
}

module.exports = {
    encryptPassword,
    matchPassword,
    validatePassword
};
