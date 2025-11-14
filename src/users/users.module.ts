import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UsersSchema } from './users.schema'
import { UsersRepository } from './repositories/users.repository'
import { UsersService } from './services/users.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }])],
  providers: [UsersRepository, UsersService],
  exports: [UsersService, UsersRepository, MongooseModule],
})
    export class UsersModule {}