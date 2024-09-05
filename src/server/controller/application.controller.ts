import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { Application } from '../entities/application.entity';
import { generateClientKey, generateClientSecret } from '../utils/clientAuth';
import { Permission } from '../entities/permission.entity';
import { User } from '../entities/auth_code.entity';
import CustomErrorResponse from '../config/customerror';
import { SECURITY_KEY } from '../config/systemkeys';
import { ApplicationResponse, CreateApplicationRequest, UpdateApplicationRequest } from '../dto/application';

export class ApplicationController {
  private applicationRepository = AppDataSource.getRepository(Application);
  private permissionRepository = AppDataSource.getRepository(Permission);
  private userRepository = AppDataSource.getRepository(User);

  async createApplication(req: Request, res: Response) {
    const applicationDto: CreateApplicationRequest = req.body;
    const clientKey = await generateClientKey();
    const clientSecret = await generateClientSecret(SECURITY_KEY);
    const owner = await this.userRepository.findOne({ where: { user_id: applicationDto.owner_id } })

    if (!owner) {
      return CustomErrorResponse.response(404, "Owner User Not Found", res);
    }

    const newApplication = await this.applicationRepository.create({
      ...applicationDto,
      client_key: clientKey,
      client_secret: clientSecret,
      app_owner: owner,
    });

    await this.applicationRepository.save(newApplication);

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
  }

  async getApplication(req: Request, res: Response) {
    const { id } = req.params;
    const application = await this.applicationRepository.findOne({ where: { app_id: id }, relations: ['scope'] });

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
  }

  async updateApplication(req: Request, res: Response) {
    const { id } = req.params;
    const updateDto: UpdateApplicationRequest = req.body;
    const application = await this.applicationRepository.findOne({ where: { app_id: id } });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (updateDto.permission_mode) { //있으면 수정
      application.permission_mode = updateDto.permission_mode;
    }
    
    if (updateDto.app_name) { //있으면 수정
      application.app_name = updateDto.app_name;
    }

    await this.applicationRepository.save(application);

    const responseDto: ApplicationResponse = {
      app_id: application.app_id,
      app_name: application.app_name,
      client_key: application.client_key,
      permission_mode: application.permission_mode,
      created_at: application.created_at,
      updated_at: application.updated_at,
    };
    return res.json(responseDto);
  }

  async deleteApplication(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.applicationRepository.delete(id);

    if (result.affected === 0) {
      return CustomErrorResponse.response(404, "Application Not Found", res);
    }
    return res.status(204).send();
  }
}