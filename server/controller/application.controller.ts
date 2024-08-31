import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { Application } from '../entities/application.entity';
import { Scope } from '../entities/scope.entity';
import { CreateApplicationDto, UpdateApplicationDto } from '../dto/request';
import { ApplicationResponseDto } from '../dto/response';
import { generateClientKey, generateClientSecret } from '../utils/auth';

export class ApplicationController {
  private applicationRepository = AppDataSource.getRepository(Application);
  private scopeRepository = AppDataSource.getRepository(Scope);

  async createApplication(req: Request, res: Response) {
    const applicationDto: CreateApplicationDto = req.body;
    const scope = await this.scopeRepository.findOne({ where: { scope_name: applicationDto.scope_name } });
    
    if (!scope) {
      return res.status(400).json({ message: 'Invalid scope' });
    }

    const newApplication = this.applicationRepository.create({
      ...applicationDto,
      scope,
      client_key: generateClientKey(),
      client_secret: generateClientSecret(),
    });

    await this.applicationRepository.save(newApplication);
    const responseDto: ApplicationResponseDto = {
      app_id: newApplication.app_id,
      app_name: newApplication.app_name,
      client_key: newApplication.client_key,
      scope: scope.scope_name,
      created_at: newApplication.created_at,
      updated_at: newApplication.updated_at,
    };
    return res.status(201).json(responseDto);
  }

  async getApplication(req: Request, res: Response) {
    const { id } = req.params;
    const application = await this.applicationRepository.findOne({ where: { app_id: id }, relations: ['scope'] });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const responseDto: ApplicationResponseDto = {
      app_id: application.app_id,
      app_name: application.app_name,
      client_key: application.client_key,
      scope: application.scope.scope_name,
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

    if (updateDto.scope_name) {
      const scope = await this.scopeRepository.findOne({ where: { scope_name: updateDto.scope_name } });
      if (!scope) {
        return res.status(400).json({ message: 'Invalid scope' });
      }
      application.scope = scope;
    }

    if (updateDto.app_name) {
      application.app_name = updateDto.app_name;
    }

    await this.applicationRepository.save(application);
    const responseDto: ApplicationResponseDto = {
      app_id: application.app_id,
      app_name: application.app_name,
      client_key: application.client_key,
      scope: application.scope.scope_name,
      created_at: application.created_at,
      updated_at: application.updated_at,
    };
    return res.json(responseDto);
  }

  async deleteApplication(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.applicationRepository.delete(id);
    
    if (result.affected === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    return res.status(204).send();
  }
}