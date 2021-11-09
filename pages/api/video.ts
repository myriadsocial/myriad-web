import {withSentry} from '@sentry/nextjs';

import type {NextApiRequest, NextApiResponse} from 'next';
import nextConnect from 'next-connect';
import getConfig from 'next/config';

import {v2 as cloudinary} from 'cloudinary';
import {Request} from 'express';
import {unlinkSync} from 'fs';
import multer, {FileFilterCallback} from 'multer';

type NextApiRequestWithFormData = NextApiRequest & {
  file: any;
};

type ResponseVideoUpload = {
  url?: string;
  error?: string;
};

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();
const maxSize = 99 * 1024 * 1024; // for 99MB

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
  limits: {fileSize: maxSize},
  fileFilter,
});

// cloudinary config
cloudinary.config({
  cloud_name: publicRuntimeConfig.cloudinaryName,
  api_key: serverRuntimeConfig.cloudinaryAPIKey,
  api_secret: serverRuntimeConfig.cloudinarySecret,
});

// Doc on custom API configuration:
// https://nextjs.org/docs/api-routes/api-middlewares#custom-config
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect()
  .use(upload.single('video'))
  .post((req: NextApiRequestWithFormData, res: NextApiResponse<ResponseVideoUpload>) => {
    const {path, size} = req.file as Express.Multer.File;

    return res.status(400).json({
      error: 'Kegedean tong',
    });

    cloudinary.uploader.upload_large(
      path,
      {
        resource_type: 'video',
        chunk_size: 10000000,
        async: false,
        // NOTE: free cloudinary account have transform size limitation
        // and codec error is most likely from small video transformation only applied on small video
        transformation:
          size < 20000000
            ? {
                video_codec: 'auto',
                format: 'webm',
              }
            : undefined,
      },
      (err, response) => {
        unlinkSync(path);

        if (err) {
          return res.status(err.http_code).json({
            error: err.message,
          });
        }

        return res.json({url: response?.secure_url});
      },
    );
  });

export default withSentry(handler);
