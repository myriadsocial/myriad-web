import {withSentry} from '@sentry/nextjs';

import type {NextApiRequest, NextApiResponse} from 'next';
import nextConnect from 'next-connect';

import {Request} from 'express';
import {unlinkSync} from 'fs';
import multer, {FileFilterCallback} from 'multer';
import admin from 'src/lib/firebase-admin';
import {convert} from 'src/lib/video';

type NextApiRequestWithFormData = NextApiRequest & {
  file: Express.Multer.File;
};

type ResponseVideoUpload = {
  url?: string;
  error?: string;
};

// Multer config
const storage = multer.diskStorage({
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const fileExt = file.originalname.split('.').pop();
    const filename = `${new Date().getTime()}.${fileExt}`;

    cb(null, filename);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

const uploadVideo = async (filePath: string, filename: string): Promise<string> => {
  const bucket = admin.storage().bucket();
  const options = {resumable: false, metadata: {contentType: 'video/mp4'}};

  const convertedPath = await convert(filePath);

  const [file] = await bucket.upload(convertedPath, options);

  unlinkSync(convertedPath);

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
  .use(upload.single('video'))
  .post(async (req: NextApiRequestWithFormData, res: NextApiResponse<ResponseVideoUpload>) => {
    const {originalname, path} = req.file;
    console.log('req.file', req.file);

    try {
      const url = await uploadVideo(path, originalname);

      unlinkSync(path);

      return res.json({url});
    } catch (error) {
      console.log('[next-api][upload-image][error]', error);

      throw error;
    }
  });

export default withSentry(handler);
