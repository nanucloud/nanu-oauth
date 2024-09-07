import axios from 'axios';
import { CAPTCHA_KEY } from '../config/systemkeys';

export const RecaptchaVerify = async function (token: string): Promise<boolean> {
  const url = `https://www.google.com/recaptcha/api/siteverify`;
  try {
    const response = await axios.post(url, {
      event: {
        token: token,
        secret: CAPTCHA_KEY
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.data.success && response.data.score >= 0.5;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error details:', error.response.data.error);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    return false
  }
}
