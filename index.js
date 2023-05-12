const app = require('express')()
require('dotenv').config();
const bodyParser = require('body-parser')
const utils = require('./utils')
const middlewares = require('./middlewares')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const cors = require('cors');
app.use(cors());

const db = require('./db');

app.use(bodyParser.json())

app.get('/', (req, res, next)=>{
    res.send("OK")
    next()
})

app.post('/register', middlewares.hasUser ,async (req, res, next) => {
    if (!utils.validatePassword(req.body.password)) res.status(400).send({
        message: "The password do not match with the requirements",
        code: 400})
   
    const hashPassword = await utils.encryptPassword(req.body.password)
    const user = await db.createUser(req.body.name, req.body.email, hashPassword, req.body.telephones)
    res.status(200).send({id: user.id, created_at: user.created_at, modified_at: user.modified_at})
    next()
})

app.post('/login', async (req, res, next) => {
    if (!utils.validatePassword(req.body.password)) res.status(400).send({
        message: "The password do not match with the requirements",
        code: 400})
    const user = await db.loginUser(req.body.email, req.body.password)

    if (user.code) {
        res.status(401).send({
            message: "Unauthorized",
            code: 401})
    }

    const token = jwt.sign({id: user.id, email: req.body.email}, process.env.SECRET_KEY_JWT, { expiresIn: '120h' });
    res.status(200).send({token: token})
    next()
})

app.listen(process.env.PORT || 3000, () => console.log(`Server running at http://localhost:${process.env.PORT || 3000}`))

module.exports = app
