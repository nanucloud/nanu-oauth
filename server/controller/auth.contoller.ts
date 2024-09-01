import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { Application } from '../entities/application.entity';
import { User } from '../entities/user.entity';
import { AuthCode } from '../entities/auth_code.entity';
import { OAuthRequestDto, LoginDto } from '../dto/request';
import { AuthCodeResponseDto } from '../dto/response';
import { generateAuthCode, verifyPassword } from '../utils/auth';

export class AuthController {
    private applicationRepository = AppDataSource.getRepository(Application);
    private userRepository = AppDataSource.getRepository(User);
    private authCodeRepository = AppDataSource.getRepository(AuthCode);

    async handleOAuthRequest(req: Request, res: Response) {
        const { app_name, redirect_uri } = req.body as OAuthRequestDto;
        const application = await this.applicationRepository.findOne({ where: { app_name } });

        if (!application) {
            return res.status(400).json({ message: 'Invalid application' });
        }
        return res.json({
            app_name,
            client_key: application.client_key,
            redirect_uri,
        });
    }

    async login(req: Request, res: Response) {
        const { user_email, user_password, client_key } = req.body as LoginDto;
        const user = await this.userRepository.findOne({ where: { user_email } });
        const application = await this.applicationRepository.findOne({ where: { client_key } });

        if (!user || !application) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await verifyPassword(user_password, user.user_password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const authCode = generateAuthCode();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Set expiry time to 10 minutes from now

        const newAuthCode = this.authCodeRepository.create({
            user,
            application,
            code: authCode,
            expires_at: expiresAt,
        });

        await this.authCodeRepository.save(newAuthCode);

        const responseDto: AuthCodeResponseDto = {
            auth_code: newAuthCode.code,
            expires_at: newAuthCode.expires_at,
        };
        return res.status(200).json(responseDto);
    }
}
