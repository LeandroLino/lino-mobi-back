const request = require("supertest")
const app = require('./index')
const moment = require('moment');

describe('Test My app server', () => {
    it('should get main route', async () => {
        const res = await request(app).get("/")
        expect(res.text).toBe("OK");
    })
}) 

describe('Test register and login route', () => {
    let token = ''
    it('should return 200 and the id with dates', async  () => {
        const res = await request(app).post("/register")
       .send({
        "name": "Lino",
        "email": "Lino@gmail.com",
        "password": "Li1234567!",
        "telephones": [
          {
            "number": "940596713",
            "area_code": "11"
          }
        ]
       })
        
        const resObject = JSON.parse(res.text)
        expect(resObject.id).toEqual(1)
        expect(resObject.created_at).toBeTruthy()
        expect(resObject.modified_at).toBeTruthy()
    })

    it('should return 200 and the token', async  () => {
        const res = await request(app).post("/login")
       .send({
        "email": "Lino@gmail.com",
        "password": "Li1234567!",
       })
        
        const resObject = JSON.parse(res.text)
        expect(res.status).toBe(200);
        expect(resObject.token).toBeTruthy()
        token = resObject.token
    })

    it('should return 200 and the user', async () => {
        const res = await request(app).get("/search")
        .set('Authorization', 'Bearer ' + token)
        .send({
            "email": "Lino@gmail.com",
            "password": "Li1234567!",
        })
        const resObject = JSON.parse(res.text)
        console.log(resObject.telephones, "search")

        expect(res.status).toBe(200);
        expect(resObject.id).toBe(1)
        expect(resObject.name).toBe('Lino')
        expect(resObject.email).toBe('Lino@gmail.com')
        expect(resObject.created_at).toBeTruthy()
        expect(resObject.modified_at).toBeTruthy()

        expect(resObject.telephones.id).toBe(1)
        expect(resObject.telephones.user_id).toBe(1)
        expect(resObject.telephones.number).toBe('940596713')
        expect(resObject.telephones.area_code).toBe('11')
    })
  })
