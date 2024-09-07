import crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_KEY, JWT_REF_KEY } from '../config/systemkeys';

//클라이언트 ID 생성
export function generateClientKey(length: number = 6): string {
    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(charset.length);
        key += charset[randomIndex];
    }
    return key;
}

//클라이언트 개인키 생성
export async function generateClientSecret(plainTextSecret: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(plainTextSecret, saltRounds);
}

//클라이언트 개인키 인증
export async function verifyClientSecret(plainTextSecret: string, hashedSecret: string): Promise<boolean> {
    return bcrypt.compare(plainTextSecret, hashedSecret);
}

//액세스토큰 생성
export async function generateAccessToken(payload:string): Promise<string> {
    return jwt.sign(payload, JWT_KEY, { expiresIn: '1m' })
}

//리프레시토큰 생성
export async function generateRefreshToken(payload:string): Promise<string> {
    return jwt.sign(payload, JWT_REF_KEY, { expiresIn: '1h' })
}
export async function isRefreshKeyValid(payload:string): Promise<string> {
    return jwt.sign(payload, JWT_REF_KEY, { expiresIn: '1h' })
}