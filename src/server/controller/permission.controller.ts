// user.controller.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { CreateUserDto, PermissionDto, UpdateUserDto } from '../dto/request';
import { UserResponseDto } from '../dto/response';
import CustomErrorResponse from '../config/customerror';

import { Permission } from '../entities/permission.entity';
import { User } from '../entities/user.entity';
import { Application } from '../entities/application.entity';

export class PermissionController {
  private permissionRepository = AppDataSource.getRepository(Permission);
  private userRepository = AppDataSource.getRepository(User);
  private applicationRepository = AppDataSource.getRepository(Application);

  async createPermission(req: Request, res: Response) {
    const permission: PermissionDto = req.body;

    const permissionUser = await this.userRepository.findOne({ where: { user_id: permission.permission_user } });
    const permissionApplication = await this.applicationRepository.findOne({ where: { app_id: permission.permission_app } });

    if (!permissionUser || !permissionApplication) {
      CustomErrorResponse.response(404, 'User or Application Not Found', res);
    }

    const newPermission = this.permissionRepository.create({
      permission_user: permissionUser as User,
      permission_app: permissionApplication as Application,
      permission_message: permission.permission_message,
      permission_status: 1,
    });

    await this.permissionRepository.save(newPermission);
    res.status(201).json(newPermission);
  }
}
