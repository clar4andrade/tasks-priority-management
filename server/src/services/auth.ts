import 'dotenv/config'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface TokenInterface {
  sub: string
}

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt)
  }

  public static async comparePasswords(
    password: string,
    hash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  public static generateToken(sub: string): string {
    return jwt.sign({ sub }, process.env.SECRET as string, {
      expiresIn: process.env.EXPIRES,
    })
  }

  public static decodeToken(token: string): TokenInterface {
    return jwt.verify(token, process.env.SECRET as string) as TokenInterface
  }
}
