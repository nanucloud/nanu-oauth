import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { User } from '../entities/user.entity';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../dto/user';

const userRepository = AppDataSource.getRepository(User);

export const FindUser = async (req: Request, res: Response) => {
  try {
    const { user_email } = req.params;
    const user = await userRepository.findOne({ where: { user_email: user_email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const responseDto: UserResponse = {
      user_id: user.user_id,
      user_email: user.user_email,
      user_name: user.user_name,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    return res.json(responseDto);
  } catch (err) {
    return res.status(500);
  }
}