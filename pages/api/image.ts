import {withSentry} from '@sentry/nextjs';

import type {NextApiRequest, NextApiResponse} from 'next';
import nextConnect from 'next-connect';

import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import admin from 'src/lib/firebase-admin';
import {v4 as uuid} from 'uuid';

type NextApiRequestWithFormData = NextApiRequest & {
  file: Express.Multer.File;
};

type ResponseImageUpload = {
  url?: string;
  error?: string;
};

const mutations = [
  {
    type: 'thumbnail',
    width: 200,
    height: 200,
  },
  {
    type: 'small',
    width: 400,
    height: 400,
  },
  {
    type: 'medium',
    width: 600,
    height: 600,
  },
];

// Multer config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
});

const uploadImage = async (image: Buffer, filename: string): Promise<string> => {
  const bucket = admin.storage().bucket();

  const parsed = path.parse(filename);
  const format = 'jpg';
  const uniqueId = uuid();
  const options = {resumable: false, metadata: {contentType: 'image/jpg'}};

  const baseFilename = `${parsed.name}_${uniqueId}`;

  // TODO: do this asynchronously on child process to reduce API load
  for (const mutation of mutations) {
    const file = bucket.file(`${baseFilename}_${mutation.type}.${format}`);

    const resized = await sharp(image)
      .resize({width: mutation.width})
      .toFormat(format)
      .toBuffer({resolveWithObject: true});

    await file.save(resized.data, options);
  }

  const file = bucket.file(`${baseFilename}.${format}`);

  const resized = await sharp(image).toFormat(format).toBuffer({resolveWithObject: true});

  await file.save(resized.data, options);

  return file.publicUrl();
};

// Doc on custom API configuration:
// https://nextjs.org/docs/api-routes/api-middlewares#custom-config
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect()
  .use(upload.single('image'))
  .post(async (req: NextApiRequestWithFormData, res: NextApiResponse<ResponseImageUpload>) => {
    const {originalname, buffer} = req.file;

    try {
      const url = await uploadImage(buffer, originalname);

      return res.json({url});
    } catch (error) {
      console.log('[next-api][upload-image][error]', error);

      throw error;
    }
  });

export default withSentry(handler);
