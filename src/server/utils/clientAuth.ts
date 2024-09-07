import crypto from 'crypto';
import * as bcrypt from 'bcrypt';

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

//클라이언트 인증키 생성
export function generateAuthCode(): string {
  const length = Math.floor(Math.random() * (24 - 12 + 1)) + 12; //인증키 길이 난수화
  return crypto.randomBytes(length).toString('hex').slice(0, length); //랜덤 바이트 생성
}