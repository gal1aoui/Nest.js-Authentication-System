import { SetMetadata } from "@nestjs/common"
import { UserRole } from "src/types/user"

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles)
