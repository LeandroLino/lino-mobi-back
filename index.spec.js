const request = require('supertest')
const app = require('./index')

const userRegister = {
  name: 'Lino',
  email: 'Lino@gmail.com',
  password: 'Li1234567!',
  telephones: [
    {
      number: '940596713',
      area_code: '11',
      name: 'Leandro'
    }]
}

const userLogin = {
  email: 'Lino@gmail.com',
  password: 'Li1234567!'
}

describe('Test My app server', () => {
  describe('Main route', () => {
    it('should get main route', async () => {
      const res = await request(app).get('/')
      expect(res.text).toBe('OK')
    })
  })

  describe('Test users routes', () => {
    let token = ''
    it('should return 200 and the id with dates', async () => {
      const res = await request(app).post('/user/register')
        .send(userRegister)

      const resObject = JSON.parse(res.text)
      expect(resObject.id).toEqual(1)
      expect(resObject.created_at).toBeTruthy()
      expect(resObject.modified_at).toBeTruthy()
    })

    it('should return 200 and the token', async () => {
      const res = await request(app).post('/user/login')
        .send({
          email: 'Lino@gmail.com',
          password: 'Li1234567!'
        })

      const resObject = JSON.parse(res.text)
      expect(res.status).toBe(200)
      expect(resObject.token).toBeTruthy()
      token = resObject.token
    })

    it('should return 200 and the user with the telephones', async () => {
      const res = await request(app).get('/user/search')
        .set('Authorization', 'Bearer ' + token)

      const resObject = JSON.parse(res.text)

      expect(res.status).toBe(200)
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

    it('should return 202 and update the user', async () => {
      const res = await request(app).put('/user/update')
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'Lino',
          email: 'Lino7@gmail.com',
          password: 'Li1234567!'
        })
      expect(res.status).toBe(202)
      const resObject = JSON.parse(res.text)

      console.log(resObject)
    })

    it('should return 202 and delete the user', async () => {
      const res = await request(app).delete('/user/delete')
        .set('Authorization', 'Bearer ' + token)

      expect(res.status).toBe(202)
      expect(res.text).toBe('{}')
    })
  })

  describe('Test telephone routes', () => {
    let token = ''

    beforeAll(async () => {
      await request(app).post('/user/register').send(userRegister)
      const res = await request(app).post('/user/login').send(userLogin)
      const resObject = JSON.parse(res.text)
      token = resObject.token
    })

    it('should return 202 and the telephone been updated', async () => {
      const res = await request(app).put('/telephone/update/1')
        .send({
          number: '940596723',
          area_code: '10',
          name: 'Lino'
        }).set('Authorization', 'Bearer ' + token)

      const resObject = JSON.parse(res.text)

      expect(res.status).toEqual(202)
      expect(resObject.id).toEqual(1)
      expect(resObject.name).toBe('Lino')
      expect(resObject.number).toBe('940596723')
      expect(resObject.area_code).toBe('10')
      expect(resObject.created_at).toBeTruthy()
      expect(resObject.modified_at).toBeTruthy()
    })

    it('should return 202 and a empty object', async () => {
      const res = await request(app).delete('/telephone/delete/1').set('Authorization', 'Bearer ' + token)
      expect(res.text).toBe('{}')
    })
  })
})
