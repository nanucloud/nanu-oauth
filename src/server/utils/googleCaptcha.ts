import axios from 'axios';
import { CAPTCHA_KEY } from '../config/systemkeys';

export const RecaptchaVerify = async function (token: string): Promise<boolean> {
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHA_KEY}&response=${token}`
    );
    return response.data.success;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}