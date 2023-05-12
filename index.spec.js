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
    it('should return 200 and the id with dates', async  () => {
        const res = await request(app).post("/register")
       .send({
        "name": "Leandro",
        "email": "leandro@gmail.com",
        "password": "Li1234567!",
        "telephones": [
          {
            "number": "940596713",
            "area_code": "11"
          }
        ]
       })
        
        const resObject = JSON.parse(res.text)
        resObject.created_at = resObject.created_at.slice(0, -4)
        resObject.modified_at = resObject.modified_at.slice(0, -4)
        const date = moment().utc().add(3, 'hours');
        const expectedDate = date.toISOString();
        expect(resObject.id).toEqual(1)
        expect(resObject.created_at).toEqual(expectedDate.slice(0, -4))
        expect(resObject.modified_at).toEqual(expectedDate.slice(0, -4))
    })

    it('should return 200 and the document number', async  () => {
        const res = await request(app).post("/login")
       .send({
        "email": "leandro@gmail.com",
        "password": "Li1234567!",
       })
        
        const resObject = JSON.parse(res.text)
        expect(res.status).toBe(200);
        expect(resObject.token).toBeTruthy()
    })
  })
