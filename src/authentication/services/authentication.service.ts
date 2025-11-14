import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UserRole } from "src/types/user"
import { UsersService } from "src/users/services/users.service"

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(userData: any) {
    console.log("Registering user with data:", userData)
    const user = await this.usersService.createUser({
      ...userData,
      role: UserRole.DEVELOPER,
    })

    const tokens = await this.generateTokens(user._id.toString())

    return {
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersService.validateUser(email, password)

    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const tokens = await this.generateTokens(user._id.toString())

    await this.usersService.updateUser(user._id.toString(), {
      lastLoginAt: new Date(),
    } as any)

    return {
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    }
  }

  async generateTokens(userId: string) {
    const user = await this.usersService.getUserById(userId)

    const payload = {
      sub: userId,
      email: user.email,
      role: user.role,
    }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: "15m",
    })

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: "7d",
    })

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    }
  }

  async getUserProfile(userId: string) {
    return this.usersService.getUserById(userId)
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token)
      return payload
    } catch (error) {
      throw new UnauthorizedException("Invalid token")
    }
  }
}
