const jwt = require('jsonwebtoken');
const db = require('./db')

async function verifyToken(req, res, next) {
  const token = req.headers['authorization'].split("Bearer")[1].trim();

  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }
  
  jwt.verify(token, process.env.SECRET_KEY_JWT, function(err, decoded) {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    req.body = decoded;
    next();
    });
}
  
async function hasUser(req, res, next) {
    const hasUser = await db.getUserByEmail(req.body.email);
    if(hasUser){
        res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
      next();
}

  module.exports ={
      verifyToken,
      hasUser
  }
