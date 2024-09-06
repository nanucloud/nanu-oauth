import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { User } from '../entities/user.entity';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../dto/user';
import { hashPassword, verifyPassword } from '../utils/passwordAuth';
import { jwtPayload } from '../dto/jwt';
import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../config/systemkeys';

const userRepository = AppDataSource.getRepository(User);

export const CreateUser = async (req: Request, res: Response) => {
  try {
    const userDto: CreateUserRequest = req.body;
    const user = await userRepository.findOne({ where: { user_email: userDto.user_email } });
    if (user) return res.status(400).json({ "message": "이미 있는 사용자" })
    const hashedPassword = await hashPassword(userDto.user_password);

    const newUser = userRepository.create({
      ...userDto,
      user_password: hashedPassword,
    });

    await userRepository.save(newUser);
    const responseDto: UserResponse = {
      user_id: newUser.user_id,
      user_email: newUser.user_email,
      user_name: newUser.user_name,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    };
    return res.status(201).json(responseDto);
  } catch (err) {
    return res.status(500);
  }
}

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
      user_password: user.user_password,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    return res.json(responseDto);
  } catch (err) {
    return res.status(500);
  }
}

export const FindAllUser = async (req: Request, res: Response) => {
  try {
    const user = await userRepository.find()

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500);
  }
}

export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateDto: UpdateUserRequest = req.body;
    const user = await userRepository.findOne({ where: { user_id: id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (updateDto.user_email) {
      user.user_email = updateDto.user_email;
    }
    if (updateDto.user_name) {
      user.user_name = updateDto.user_name;
    }
    if (updateDto.user_password) {
      user.user_password = await hashPassword(updateDto.user_password);
    }

    await userRepository.save(user);
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

export const DeleteUser = async (req: Request, res: Response) => {
  try {
    const { user_email } = req.params;
    const result = await userRepository.delete({ user_email: user_email });

    if (result.affected === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(204).json({ message: 'Successfully Deletd User' })
  } catch (err) {
    return res.status(500);
  }
}