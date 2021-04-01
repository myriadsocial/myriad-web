import type { NextApiRequest, NextApiResponse } from 'next';

import Axios from 'axios';

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const client = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_RECAPTCHA_API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});
const sleep = () => {
  new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, 350);
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors);

  const { body, method } = req;
  const { captcha } = body;

  console.log('>>> ini req-nya', body);

  // Only process the API call if the method is POST
  if (method === 'POST') {
    if (!captcha)
      return res.status(422).json({
        message: 'Unprocessable request, please provide the required fields'
      });

    try {
      const response = await client({
        url: `?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
        method: 'POST'
      });

      const captchaValidation = await response.data;

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
        //sleep();
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
