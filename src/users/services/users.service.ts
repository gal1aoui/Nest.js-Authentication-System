import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { UsersRepository } from "../repositories/users.repository"
import { IUserCreate, UserRole, UserStatus } from "src/types/user"

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async createUser(userData: IUserCreate): Promise<any> {
    const existingUser = await this.userRepository.findByEmail(userData.email)
    if (existingUser) {
      throw new ConflictException("Email already registered")
    }

    const passwordHash = await bcrypt.hash(userData.password, 10)

    return this.userRepository.create({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      passwordHash,
      role: userData.role,
      status: UserStatus.ACTIVE,
      projectIds: [],
      preferences: {
        theme: "dark",
        notifications: false,
        emailNotifications: false,
      },
    })
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new NotFoundException("User not found")
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      throw new NotFoundException("Invalid credentials")
    }

    return user
  }

  async getUserById(id: string): Promise<any> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundException("User not found")
    }

    const { passwordHash, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async updateUser(id: string, updateData: Partial<IUserCreate>): Promise<any> {
    const user = await this.userRepository.update(id, updateData)
    if (!user) {
      throw new NotFoundException("User not found")
    }

    const { passwordHash, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async getUsersByRole(role: UserRole): Promise<any[]> {
    const users = await this.userRepository.findAll()
    return users[0].filter((u) => u.role === role)
  }
}
