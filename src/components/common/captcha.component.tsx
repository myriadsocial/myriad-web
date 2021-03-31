import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function CaptchaComponent() {
  const recaptchaRef = useRef<HTMLInputElement>(null);

  const onReCAPTCHAChange = (captchaCode: string | null): void => {
    // If the reCAPTCHA code is null or undefined indicating that
    // the reCAPTCHA was expired then return early
    if (!captchaCode) {
      return;
    }
    // Else reCAPTCHA was executed successfully so proceed with the
    // alert
    alert(`Recaptcha successfully submitted! the code: ${captchaCode}`);
    // Reset the reCAPTCHA so that it can be executed again if user
    // submits another name
    recaptchaRef.current.reset();
  };

  return (
    <>
      <ReCAPTCHA ref={recaptchaRef} size="normal" sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={onReCAPTCHAChange} />
    </>
  );
}
