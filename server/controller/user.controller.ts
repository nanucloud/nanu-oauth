// user.controller.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/request';
import { UserResponseDto } from '../dto/response';
import { hashPassword } from '../utils/auth';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(req: Request, res: Response) {
    const userDto: CreateUserDto = req.body;
    const hashedPassword = await hashPassword(userDto.user_password);
    
    const newUser = this.userRepository.create({
      ...userDto,
      user_password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    const responseDto: UserResponseDto = {
      user_id: newUser.user_id,
      user_email: newUser.user_email,
      user_name: newUser.user_name,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    };
    return res.status(201).json(responseDto);
  }

  async getUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const responseDto: UserResponseDto = {
      user_id: user.user_id,
      user_email: user.user_email,
      user_name: user.user_name,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    return res.json(responseDto);
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const updateDto: UpdateUserDto = req.body;
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    
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

    await this.userRepository.save(user);
    const responseDto: UserResponseDto = {
      user_id: user.user_id,
      user_email: user.user_email,
      user_name: user.user_name,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    return res.json(responseDto);
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.userRepository.delete(id);
    
    if (result.affected === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(204).send();
  }
}
