import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { Application } from '../entities/application.entity';
import { generateClientKey, generateClientSecret } from '../utils/clientAuth';
import { Permission } from '../entities/permission.entity';
import { User } from '../entities/refresh_token.entity';
import CustomErrorResponse from '../config/customerror';
import { SECURITY_KEY } from '../config/systemkeys';
import { ApplicationResponse, CreateApplicationRequest, UpdateApplicationRequest } from '../dto/application';

const permissionRepository = AppDataSource.getRepository(Permission);
const userRepository = AppDataSource.getRepository(User);
const applicationRepository = AppDataSource.getRepository(Application);

export const createApplication = async (req: Request, res: Response) => {
  const applicationDto: CreateApplicationRequest = req.body;
  const clientKey = await generateClientKey();
  const clientSecret = await generateClientSecret(SECURITY_KEY);
  const owner = await userRepository.findOne({ where: { user_id: applicationDto.owner_id } });

  if (!owner) {
    return CustomErrorResponse.response(404, "Owner User Not Found", res);
  }

  const newApplication = applicationRepository.create({
    ...applicationDto,
    client_key: clientKey,
    client_secret: clientSecret,
    app_owner: owner,
  });

  await applicationRepository.save(newApplication);

  const responseDto: ApplicationResponse = {
    app_id: newApplication.app_id,
    app_name: newApplication.app_name,
    client_key: newApplication.client_key,
    client_secret: newApplication.client_secret,
    created_at: newApplication.created_at,
    updated_at: newApplication.updated_at,
    permission_mode: newApplication.permission_mode,
  };
  return res.status(201).json(responseDto);
};

export const getApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const application = await applicationRepository.findOne({ where: { app_id: id }, relations: ['scope'] });

  if (!application) {
    return CustomErrorResponse.response(404, "Application Not Found", res);
  }

  const responseDto: ApplicationResponse = {
    app_id: application.app_id,
    app_name: application.app_name,
    client_key: application.client_key,
    permission_mode: application.permission_mode,
    created_at: application.created_at,
    updated_at: application.updated_at,
  };
  return res.json(responseDto);
};

export const getApplications = async (req: Request, res: Response) => {
  const application = await applicationRepository.find();

  if (!application) {
    return CustomErrorResponse.response(404, "Application Not Found", res);
  }
  return res.json(application);
};

export const updateApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateDto: UpdateApplicationRequest = req.body;
  const application = await applicationRepository.findOne({ where: { app_id: id } });

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  if (updateDto.permission_mode) {
    application.permission_mode = updateDto.permission_mode;
  }

  if (updateDto.app_name) {
    application.app_name = updateDto.app_name;
  }

  await applicationRepository.save(application);

  const responseDto: ApplicationResponse = {
    app_id: application.app_id,
    app_name: application.app_name,
    client_key: application.client_key,
    permission_mode: application.permission_mode,
    created_at: application.created_at,
    updated_at: application.updated_at,
  };
  return res.json(responseDto);
};

export const deleteApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await applicationRepository.delete(id);

  if (result.affected === 0) {
    return CustomErrorResponse.response(404, "Application Not Found", res);
  }
  return res.status(204).send();
};
