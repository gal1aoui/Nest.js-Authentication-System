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
      secret: process.env.JWT_SECRET || "bb323d3665bfffcecda45f30505c609c452c62b7df9bc25277bc03e834768e27",
      signOptions: { expiresIn: "15m" },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy],
  exports: [AuthenticationService, JwtModule],
})
export class AuthenticationModule {}
