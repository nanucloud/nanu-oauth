import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { Application } from '../entities/application.entity';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh_token.entity';
import { Permission } from '../entities/permission.entity';
import { OAuthLoginRequest, RefreshTokenRequest, RefreshTokenResponse } from '../dto/oauth';
import { generateAccessToken, generateRefreshToken, isRefreshTokenValid, verifyAccessToken  } from '../utils/clientAuth';
import { verifyPassword } from '../utils/passwordAuth';
import { RecaptchaVerify } from '../utils/googleCaptcha';
import { jwtPayload } from '../dto/jwt';

// 데이터베이스 레포지토리 초기화
const applicationRepository = AppDataSource.getRepository(Application);
const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const permissionRepository = AppDataSource.getRepository(Permission);

export const OAuthLogin = async (req: Request, res: Response) => {
    const oauthLoginRequest: OAuthLoginRequest = req.body;

    // reCAPTCHA와 URI 유효성 검사
    if (!RecaptchaVerify(oauthLoginRequest.token) || !isValidDomain(oauthLoginRequest.redirect_uri)) {
        return res.status(401).json({ message: 'Security issue occurred' });
    }

    // 애플리케이션 및 사용자 검색
    const application = await applicationRepository.findOne({ where: { app_id: oauthLoginRequest.app_id } });
    const user = await userRepository.findOne({ where: { user_email: oauthLoginRequest.user_email } });

    // 사용자 및 애플리케이션 유효성 확인
    if (!application || !user || !(await verifyPassword(oauthLoginRequest.user_password, user.user_password))) {
        return res.status(404).json({ message: 'Please check your password, ID, or application' });
    }

    // 사용자 권한 확인
    const permissions = await permissionRepository.findOne({
        relations: ['permission_user', 'permission_app'],
        where: {
            permission_user: { user_id: user.user_id },
            permission_app: { app_id: application.app_id }
        }
    });

    if (!permissions || permissions.permission_status !== 1) { // 권한이 없거나 거부된 경우
        return res.status(403).json({ message: 'Access denied' });
    }

    // JWT 페이로드 생성
    const payload: jwtPayload = {
        user_id: user.user_id,
        user_email: user.user_email,
    };

    // 액세스 토큰 및 리프레시 토큰 생성
    const access_token = await generateAccessToken(payload); // 새로운 액세스 토큰 생성
    const refresh_token = await generateRefreshToken(payload); // 새로운 리프레시 토큰 생성

    // 리프레시 토큰 저장
    const newRefreshToken = refreshTokenRepository.create({
        auth_code: refresh_token,
        user: user,
        application: application,
        valid: 1,
        created_at: new Date(),
        permission_level: permissions.permission_status
    });

    await refreshTokenRepository.save(newRefreshToken);
    console.log

    res.status(200).json({ "moveto": oauthLoginRequest.redirect_uri + "?ACCESS=" + access_token + "&REFRESH=" + refresh_token })
};
export const OAuthRefresh = async (req: Request, res: Response) => {
    const refreshLoginRequest: RefreshTokenRequest = req.body;

    // 리프레시 토큰을 데이터베이스에서 찾기, 관계 함께 로드
    const token = await refreshTokenRepository.findOne({
        where: { auth_code: refreshLoginRequest.refresh_token },
        relations: ['user', 'application'], // user와 application 관계를 함께 로드
    });

    if (!token) {
        return res.status(400).json({ message: 'Invalid refresh token' });
    }

    if (!token.valid || !isRefreshTokenValid(token.auth_code)) {
        return res.status(401).json({ message: 'Refresh token expired or invalid' });
    }

    // 권한 확인
    const permissions = await permissionRepository.find({
        where: {
            permission_user: { user_id: token.user.user_id },
            permission_app: { app_id: token.application.app_id },
        },
    });

    if (permissions.length === 0) {
        return res.status(403).json({ message: 'No permission for this application' });
    }

    const payload = {
        user_id: token.user.user_id,
        user_email: token.user.user_email,
    };

    // 새 액세스 토큰 생성
    const access_token = await generateAccessToken(payload);

    return res.json({
        access_token,
    } as RefreshTokenResponse);
};


const isValidDomain = (url: string) => { // 도메인 검증
    try {
        const { hostname } = new URL(url);
        return hostname.endsWith('nanu.cc') || hostname.endsWith('ncloud.sbs');
    } catch (error) {
        return false;
    }
};

export const clientAuthValidation = async (req: Request, res: Response) => {
    const { ClientId } = req.params;
    const { access_token } = req.body;

    try {
        const application = await applicationRepository.findOne({ where: { client_key: ClientId } });
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const payload = await verifyAccessToken(access_token) as jwtPayload;
        if (!payload) {
            return res.status(401).json({ message: 'Invalid access token' });
        }

        const user = await userRepository.findOne({ where: { user_id: payload.user_id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (application.permission_mode === 1) {
            const permission = await permissionRepository.findOne({
                where: {
                    permission_user: { user_id: user.user_id },
                    permission_app: { app_id: application.app_id },
                    permission_status: 1,
                }
            });

            if (!permission) {
                return res.status(403).json({ message: 'User does not have permission for this application' });
            }
        }

        return res.status(200).json({
            message: 'Token is valid and user is authorized',
            user_id: user.user_id,
            user_email: user.user_email
        });

    } catch (error) {
        console.error('Error in client authentication:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};