import { UserMongoDBRepository } from '@src/repositories/userMongoDBRepository'
import AuthService from '@src/services/auth'

let token: string
const userRepository = new UserMongoDBRepository()

beforeEach(async () => {
  await userRepository.deleteAll()
})

const test_user = {
  name: 'John',
  surname: 'Doe',
  email: 'doe@gmail.com',
  password: 'abcABC123!'
}

const error_test_user = {
  name: 'John',
  surname: 'Doe',
  email: 'doe@gmail.com'
}

const update_test_user = {
  email: 'newemail@gmail.com',
}

describe('when signing up a user', () => {
  it('should succesfully sign up a user', async () => {
    const res = await global.testRequest
      .post('/api/users/signup')
      .send(test_user)

    expect(res.status).toBe(201)

    await expect(
      AuthService.comparePasswords(test_user.password, res.body.user.password)
    ).resolves.toBeTruthy()

    expect(res.body.user).toEqual(
      expect.objectContaining({
        ...test_user,
        ...{ password: expect.any(String) },
      })
    )
  })

  it('Should return a validation error when required field is missing', async () => {
    const res = await global.testRequest
      .post('/api/users/signup')
      .send(error_test_user)

    expect(res.status).toBe(400)
    expect(res.body).toEqual({
      code: 400,
      error: '400',
      message: 'User validation failed: password: Path `password` is required.',
    })
  })

  it('Should return 409 when the email already exists', async () => {
    await global.testRequest.post('/api/users/signup').send(test_user)
    const res = await global.testRequest
      .post('/api/users/signup')
      .send(test_user)

    expect(res.status).toBe(409)
    expect(res.body).toEqual({
      code: 409,
      error: '409',
      message: 'User validation failed: email: already exists in the database.',
    })
  })
})

describe('when get /api/users/me', () => {
  it('should return the user if token is valid', async () => {
    const newUser = await userRepository.create(test_user)
    token = AuthService.generateToken(newUser.id)

    const res = await global.testRequest
      .get(`/api/users/me`)
      .set({ 'x-access-token': token })

    const { user } = res.body

    expect(res.status).toBe(200)
    expect(user).toHaveProperty('id', newUser.id)
    expect(user).toEqual(
      expect.objectContaining({
        ...test_user,
        ...{ password: expect.any(String) },
      })
    )
  })

  it('Should return unauthorized if token missing', async () => {
    const res = await global.testRequest.get(`/api/users/me`)

    expect(res.status).toBe(401)
    expect(res.body).toEqual({
      code: 401,
      error: 'Unauthorized',
    })
  })

  it('Should return not found if user was not found in db', async () => {
    const token = AuthService.generateToken('fake-test-id')

    const res = await global.testRequest
      .get(`/api/users/me`)
      .set({ 'x-access-token': token })

    expect(res.status).toBe(404)
    expect(res.body).toEqual({
      code: 404,
      error: '404',
      message: 'User not found!',
    })
  })
})

describe('when patch /api/users', () => {
  it('should update user id id is valid', async () => {
    const newUser = await userRepository.create(test_user)
    token = AuthService.generateToken(newUser.id)

    const res = await global.testRequest
      .patch(`/api/users/${newUser.id}/`)
      .set({ 'x-access-token': token })
      .send(update_test_user)

    const updated = res.body

    expect(res.status).toBe(200)
    expect(updated).toHaveProperty('email', update_test_user.email)
  })

})

describe('when login user', () => {
  it('should return user with a valid token', async () => {
    const user = await userRepository.create(test_user)
    const res = await global.testRequest
      .post('/api/users/login')
      .send({ email: test_user.email, password: test_user.password })

    const verify = AuthService.decodeToken(res.body.token)
    expect(verify).toMatchObject({ sub: user.id })
  })

  it('Should return UNAUTHORIZED if the user with the given email is not found', async () => {
    const res = await global.testRequest
      .post('/api/users/login')
      .send({ email: 'error-test-email@mail.com', password: '123' })

    expect(res.status).toBe(401)
    expect(res.body).toEqual({
      code: 401,
      error: '401',
      message: 'User not Found',
    })
  })

  it('Should return UNAUTHORIZED if the user is found but the password does not match', async () => {
    await userRepository.create(test_user)
    const res = await global.testRequest
      .post('/api/users/login')
      .send({ email: test_user.email, password: 'different password' })

    expect(res.status).toBe(401)
    expect(res.body).toEqual({
      code: 401,
      error: '401',
      message: 'Wrong Credentials',
    })
  })
})

//find a way to delete user or disable
