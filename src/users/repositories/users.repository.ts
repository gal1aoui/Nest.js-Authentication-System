import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model, Types } from 'mongoose';
import { User } from '../users.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(new Types.ObjectId(id)).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(skip = 0, limit = 10): Promise<[User[], number]> {
    const [users, total] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(),
    ]);
    return [users, total];
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(new Types.ObjectId(id), userData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel
      .deleteOne({ _id: new Types.ObjectId(id) })
      .exec();
    return result.deletedCount > 0;
  }

  async addProjectToUser(
    userId: string,
    projectId: string,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(
        new Types.ObjectId(userId),
        { $addToSet: { projectIds: new Types.ObjectId(projectId) } },
        { new: true },
      )
      .exec();
  }
}
