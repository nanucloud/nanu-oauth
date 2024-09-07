import axios from 'axios';
import { CAPTCHA_KEY, GCP_PROJECT_ID } from '../config/systemkeys';

export const RecaptchaVerify = async function(token: string): Promise<boolean> {
  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${GCP_PROJECT_ID}/assessments?key=${CAPTCHA_KEY}`;

  try {
    const response = await axios.post(url, {
      event: {
        token,
        siteKey: '6LeajjcqAAAAAGX1QMsPq1aSHwN5fHsG-z_9v_yh',
        expectedAction: 'join',
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const { riskAnalysis } = response.data;
    return riskAnalysis.score >= 0.5;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
}
