import type { NextApiRequest, NextApiResponse } from 'next';

import fetch from 'node-fetch';

const sleep = () => {
  new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, 350);
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body, method } = req;
  const { captcha } = body;

  // Only process the API call if the method is POST
  if (method === 'POST') {
    if (!captcha)
      return res.status(422).json({
        message: 'Unprocessable request, please provide the required fields'
      });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_RECAPTCHA_API_URL}?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
          },
          method: 'POST'
        }
      );

      const captchaValidation = await response.json();

      /**
* The structure of response from the verify API is
* {
* "success": true|false,
* "challenge_ts": timestamp, // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
* "hostname": string, // the hostname of the site where the reCAPTCHA was solved
* "error-codes": [...] // optional
}
*/

      if (captchaValidation.success) {
        sleep();
        return res.status(200).send('OK');
      }

      return res.status(422).json({
        message: 'Unprocessable request, Invalid captcha code'
      });
    } catch (error) {
      console.log(error);
      return res.status(422).json({ message: 'Something went wrong!' });
    }
  }

  // Return 404 if someone pings the API with a method other than
  // POST
  return res.status(404).send('Not found');
};
