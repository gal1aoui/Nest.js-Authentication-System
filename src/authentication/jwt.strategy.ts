import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "bb323d3665bfffcecda45f30505c609c452c62b7df9bc25277bc03e834768e27",
    })
  }

  async validate(payload: any) {
    console.log("JWT Payload:", payload)
    return {
      _id: payload.sub,
      email: payload.email,
      role: payload.role,
    }
  }
}
