import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import { userLoginSchema, userRegisterSchema } from 'src/types';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type IUser, type IUserCreate } from 'src/types/user';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post('register')
  async register(@Body() body: IUserCreate) {
    const validatedData = userRegisterSchema.parse(body);
    return this.authService.register(validatedData);
  }

  @Post('login')
  async login(@Body() body: Partial<IUserCreate>) {
    const validatedData = userLoginSchema.parse(body);
    return this.authService.login(validatedData.email, validatedData.password);
  }

  @Post('refresh')
  @UseGuards(JwtGuard)
  async refreshToken(@CurrentUser('_id') userId: string) {
    return this.authService.generateTokens(userId);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getCurrentUser(@CurrentUser() user: IUser) {
    return this.authService.getUserProfile(user._id);
  }
}
