import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { Application } from '../entities/application.entity';
import { CreateApplicationDto, UpdateApplicationDto } from '../dto/request';
import { ApplicationResponseDto } from '../dto/response';
import { generateClientKey, generateClientSecret } from '../utils/clientAuth';
import { Permission } from '../entities/permission.entity';
import CustomErrorResponse from '../config/customerror';
import { SECURITY_KEY } from '../config/systemkeys';

export class ApplicationController {
  private applicationRepository = AppDataSource.getRepository(Application);
  private permissionRepository = AppDataSource.getRepository(Permission);

  async createApplication(req: Request, res: Response) {
    const applicationDto: CreateApplicationDto = req.body;
    const clientKey = await generateClientKey();
    const clientSecret = await generateClientSecret(SECURITY_KEY);
    const newApplication = await this.applicationRepository.create({
      ...applicationDto,
      client_key: clientKey,
      client_secret: clientSecret,
    });

    await this.applicationRepository.save(newApplication);
    
    const responseDto: ApplicationResponseDto = {
      app_id: newApplication.app_id,
      app_name: newApplication.app_name,
      client_key: newApplication.client_key,
      client_secret: newApplication.client_secret,
      created_at: newApplication.created_at,
      updated_at: newApplication.updated_at,
      access_mode: newApplication.permission_mode,
    };
    return res.status(201).json(responseDto);
  }

  async getApplication(req: Request, res: Response) {
    const { id } = req.params;
    const application = await this.applicationRepository.findOne({ where: { app_id: id }, relations: ['scope'] });

    if (!application) {
      return CustomErrorResponse.response(404,"Application Not Found",res);
    }

    const responseDto: ApplicationResponseDto = {
      app_id: application.app_id,
      app_name: application.app_name,
      client_key: application.client_key,
      access_mode: application.permission_mode,
      created_at: application.created_at,
      updated_at: application.updated_at,
    };
    return res.json(responseDto);
  }

  async updateApplication(req: Request, res: Response) {
    const { id } = req.params;
    const updateDto: UpdateApplicationDto = req.body;
    const application = await this.applicationRepository.findOne({ where: { app_id: id } });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (updateDto.access_mode) {
      application.permission_mode = updateDto.access_mode;
    }
    if (updateDto.app_name) {
      application.app_name = updateDto.app_name;
    }

    await this.applicationRepository.save(application);

    const responseDto: ApplicationResponseDto = {
      app_id: application.app_id,
      app_name: application.app_name,
      client_key: application.client_key,
      access_mode: application.permission_mode,
      created_at: application.created_at,
      updated_at: application.updated_at,
    };
    return res.json(responseDto);
  }

  async deleteApplication(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.applicationRepository.delete(id);

    if (result.affected === 0) {
      return CustomErrorResponse.response(404,"Application Not Found",res);
    }

    return res.status(204).send();
  }


}