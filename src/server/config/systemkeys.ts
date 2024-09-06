import dotenv from 'dotenv';
dotenv.config();

export const SECURITY_KEY = process.env._SYSTEM_PASSWORD || '0000';
export const JWT_KEY = process.env._JWT_SECRET || '0000';
export const CAPTCHA_KEY = process.env._GOOGLE_CAPTCHA_KEY || 'error';
export const ADMIN_EMAIL = process.env._ADMIN_EMAIL_ADDR || 'test@nanu.cc';