import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { Application } from '../entities/application.entity';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh_token.entity';
import { Permission } from '../entities/permission.entity';
import { OAuthRequest, RefreshTokenRequest, RefreshTokenResponse } from '../dto/oauth';
import { generateAuthCode } from '../utils/clientAuth';
import { verifyPassword } from '../utils/passwordAuth';

// 데이터베이스 레포지토리 초기화
const applicationRepository = AppDataSource.getRepository(Application);
const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const permissionRepository = AppDataSource.getRepository(Permission);

//OAuth 처리 클라이언트 주소
const OAUTH_CLIENT_ADDR = 'localhost:3000/oauthrun.html';

// OAuth 로그인 처리
export const OAuthLogin = async (req: Request, res: Response) => {
    const { app_id, redirect_uri } = req.body as OAuthRequest;
    const application = await applicationRepository.findOne({ where: { app_id } });

    if (!application || !isValidDomain(redirect_uri)) {
        return res.status(400).json({ message: 'Invalid application' });
    }

    const oauth_url = `${OAUTH_CLIENT_ADDR}?app_id=${app_id}&app_name=${application.app_name}&redirect=${redirect_uri}`
    
    res.redirect(oauth_url);
};

// OAuth 리프레시 처리
export const OAuthRefresh = async (req: Request, res: Response) => {
    const { refresh_token } = req.body as RefreshTokenRequest;

    // 리프레시 토큰을 데이터베이스에서 찾기
    const token = await refreshTokenRepository.findOne({ where: { auth_code: refresh_token } });

    if (!token) {
        return res.status(400).json({ message: 'Invalid refresh token' });
    }

    // 리프레시 토큰 유효성 검사
    if (!token.valid || token.expires_at < new Date()) {
        return res.status(401).json({ message: 'Refresh token expired or invalid' });
    }

    // 권한 확인
    const permissions = await permissionRepository.find({
        where: {
            permission_user: token.user,
            permission_app: token.application,
        },
    });

    if (permissions.length === 0) {
        return res.status(403).json({ message: 'No permission for this application' });
    }

    // 새로운 액세스 토큰 생성
    const access_token = generateAuthCode();

    return res.json({
        access_token,
    } as RefreshTokenResponse);
};

const isValidDomain = (url:string) => { // 도메인 검증
    try {
        const { hostname } = new URL(url);
        return hostname.endsWith('nanu.cc') || hostname.endsWith('ncloud.sbs');
    } catch (error) {
        return false;
    }
};