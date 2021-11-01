import React, {useState, useRef, useEffect} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import {useStyles} from './captcha.style';

type Props = {
  getCaptchaVerification: (isVerified: boolean) => void;
};

export default function CaptchaComponent({getCaptchaVerification}: Props) {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const styles = useStyles();

  // 2nd component to make setCaptchaVerified works
  useEffect(() => {
    if (captchaVerified) {
      getCaptchaVerification(captchaVerified);
    }
  }, [captchaVerified]);

  const recaptchaRef = useRef(null);

  const onReCAPTCHAChange = async (captchaCode: string | null): Promise<void> => {
    // If the reCAPTCHA code is null or undefined indicating that
    // the reCAPTCHA was expired then return early
    if (!captchaCode) {
      return;
    }
    try {
      const response = await fetch('/api/captcha', {
        method: 'POST',
        body: JSON.stringify({captcha: captchaCode}),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        changeVerifiedStatus();
      } else {
        const error = await response.json();
        throw new Error(error?.message);
      }
    } catch (error) {
      alert(`the message is: ${error?.message}` || 'Something went wrong');
    }
  };

  // Recaptcha-nya di-reset kapan nih??
  //const resetRecaptcha = () => {
  //recaptchaRef.current.reset();
  //};

  // 1st component to make setCaptchaVerified works
  const changeVerifiedStatus = () => {
    setCaptchaVerified(true);
  };

  return (
    <>
      <div className={styles.captcha}>
        <ReCAPTCHA
          ref={recaptchaRef}
          size="normal"
          sitekey={`${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          onChange={onReCAPTCHAChange}
        />
      </div>
    </>
  );
}
