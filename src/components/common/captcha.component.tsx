import React, { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import { useStyles } from './captcha.style';

import Axios from 'axios';

const client = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_RECAPTCHA_API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});

export default function CaptchaComponent() {
  const styles = useStyles();
  const recaptchaRef = useRef<HTMLInputElement>(null);

  const onReCAPTCHAChange = async (captchaCode: string | null): Promise<void> => {
    // If the reCAPTCHA code is null or undefined indicating that
    // the reCAPTCHA was expired then return early
    if (!captchaCode) {
      return;
    }
    try {
      const { data } = await client({
        url: '/api/captcha',
        method: 'POST',
        data: {
          captcha: captchaCode
        }
      });

      console.log('this is the data:', data);
      // Else reCAPTCHA was executed successfully so proceed with the
      // alert
      alert(`Recaptcha successfully submitted! the code: ${captchaCode}`);
    } catch (error) {
      console.log('this is the error object:', error);
      alert(`the message is: ${error?.message}` || 'Something went wrong');
    } finally {
      // Reset the reCAPTCHA so that it can be executed again if user
      // submits another request
      recaptchaRef.current.reset();
    }
  };

  return (
    <>
      <div className={styles.captcha}>
        <ReCAPTCHA ref={recaptchaRef} size="normal" sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={onReCAPTCHAChange} />
      </div>
    </>
  );
}
