import dotenv from 'dotenv';
dotenv.config();

export const SECURITY_KEY = process.env._SYSTEM_PASSWORD || '0000';
export const JWT_KEY = process.env._JWT_SECRET || '0000';
export const JWT_REF_KEY = process.env._JWT_REF_SECRET || '0000';
export const CAPTCHA_KEY = process.env._GOOGLE_CAPTCHA_KEY || 'error';
export const GCP_PROJECT_ID = process.env._GCP_PROJECT_ID || 'error';
export const ADMIN_EMAIL = process.env._ADMIN_EMAIL_ADDR || 'test@nanu.cc';