import AuthService from '../auth'

describe('When hashing passwords', () => {
  it('Should compare a password with a hash', async () => {
    const pwd = 'sgfrg$5gr56%'
    const hash = await AuthService.hashPassword(pwd)
    const result = await AuthService.comparePasswords(pwd, hash)

    expect(result).toBeTruthy()
  })
})

describe('When generating tokens', () => {
  it('Should succesfully decode the token', () => {
    const id = 'dgrtryrtgrg'

    const token = AuthService.generateToken(id)

    const decodedToken = AuthService.decodeToken(token)
    expect(decodedToken.sub).toBe(id)
  })
})