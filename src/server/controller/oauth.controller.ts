import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { Application } from '../entities/application.entity';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh_token.entity';
import { Permission } from '../entities/permission.entity';
import { OAuthLoginRequest, OAuthRequest, RefreshTokenRequest, RefreshTokenResponse } from '../dto/oauth';
import { generateAccessToken, generateRefreshToken, isRefreshTokenValid } from '../utils/clientAuth';
import { verifyPassword } from '../utils/passwordAuth';
import { RecaptchaVerify } from '../utils/googleCaptcha';
import { jwtPayload } from '../dto/jwt';

// 데이터베이스 레포지토리 초기화
const applicationRepository = AppDataSource.getRepository(Application);
const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const permissionRepository = AppDataSource.getRepository(Permission);

//OAuth 처리 클라이언트 주소
const OAUTH_CLIENT_ADDR = 'localhost:3000/oauthrun.html';

// OAuth 로그인 처리
export const OAuthRedirect = async (req: Request, res: Response) => {
    const oauthRequest: OAuthRequest = req.body;
    const application = await applicationRepository.findOne({ where: { app_id: oauthRequest.app_id } });

    if (!application) {
        return res.status(400).json({ message: 'Invalid application' });
    }

    const oauth_url = `${OAUTH_CLIENT_ADDR}?app_id=${oauthRequest.app_id}&app_name=${application.app_name}&redirect=${oauthRequest.redirect_uri}`

    res.redirect(oauth_url);
};

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
        where: {
            permission_user: user,
            permission_app: application
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

    res.status(400).send(`${oauthLoginRequest.redirect_uri}?ACCESS=${access_token}&REFRESH=${refresh_token}`)
};

// OAuth 리프레시 처리
export const OAuthRefresh = async (req: Request, res: Response) => {
    const refreshLoginRequest: RefreshTokenRequest = req.body;

    // 리프레시 토큰을 데이터베이스에서 찾기
    const token = await refreshTokenRepository.findOne({ where: { auth_code: refreshLoginRequest.refresh_token } });

    if (!token) {
        return res.status(400).json({ message: 'Invalid refresh token' });
    }

    if (!token.valid || !isRefreshTokenValid(token.auth_code)) {
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

    const payload = {
        user_id : token.user.user_id,
        user_email : token.user.user_email,
    }

    //새 액세스토큰 생성
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