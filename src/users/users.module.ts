import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';
import { User, UsersSchema } from './users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
  ],
  providers: [UsersRepository, UsersService],
  exports: [UsersService, UsersRepository, MongooseModule],
})
export class UsersModule {}
