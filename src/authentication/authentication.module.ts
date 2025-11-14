import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { UsersModule } from "src/users/users.module"
import { AuthenticationController } from "./controllers/authentication.controller"
import { JwtStrategy } from "./jwt.strategy"
import { AuthenticationService } from "./services/authentication.service"

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "JWT_SECRET-KEY",
      signOptions: { expiresIn: "15m" },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy],
  exports: [AuthenticationService, JwtModule],
})
export class AuthenticationModule {}
