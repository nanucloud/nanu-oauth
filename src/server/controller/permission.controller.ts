// user.controller.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import CustomErrorResponse from '../config/customerror';

import { Permission } from '../entities/permission.entity';
import { User } from '../entities/user.entity';
import { Application } from '../entities/application.entity';
import { CreatePermissionRequest } from '../dto/permission';

const permissionRepository = AppDataSource.getRepository(Permission);
const userRepository = AppDataSource.getRepository(User);
const applicationRepository = AppDataSource.getRepository(Application);

export const createPermission = async (req: Request, res: Response) => {
  const permission: CreatePermissionRequest = req.body;

  const permissionUser = await userRepository.findOne({ where: { user_id: permission.permission_user } });
  const permissionApplication = await applicationRepository.findOne({ where: { app_id: permission.permission_app } });

  if (!permissionUser || !permissionApplication) {
    CustomErrorResponse.response(404, 'User or Application Not Found', res);
  }

  const newPermission = permissionRepository.create({
    permission_user: permissionUser as User,
    permission_app: permissionApplication as Application,
    permission_message: permission.permission_message,
    permission_status: 1,
  });

  await permissionRepository.save(newPermission);
  res.status(201).json(newPermission);
}

export const getPermission = async (req: Request, res: Response) => {
  const permissions = await permissionRepository.find({
    relations: ['permission_user', 'permission_app']
  });
  res.status(201).json(permissions);
}