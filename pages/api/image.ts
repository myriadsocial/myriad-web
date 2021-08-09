import type {NextApiRequest, NextApiResponse} from 'next';
import nextConnect from 'next-connect';

import {v2 as cloudinary} from 'cloudinary';
import DatauriParser from 'datauri/parser';
import multer from 'multer';
import path from 'path';
import * as sharp from 'sharp';

type NextApiRequestWithFormData = NextApiRequest & {
  file: any;
};

type ResponseImageUpload = {
  url?: string;
  error?: string;
};

const MAX_IMAGE_WIDTH = 2560; // 30inch monitor resolution 2560 x 1600
const MAX_IMAGE_SIZE = MAX_IMAGE_WIDTH * 1000;

// Multer config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
});

// cloudinary config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const cloudinaryUpload = (file: string) =>
  cloudinary.uploader.upload(file, {
    transformation: {
      width: MAX_IMAGE_WIDTH,
    },
  });

const formatBufferTo64 = (name: string, file: Buffer): DatauriParser => {
  const parser = new DatauriParser();

  return parser.format(path.extname(name).toString(), file);
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
    const fileName = req.file.originalname;
    const image = req.file.buffer as Buffer;
    let file: DatauriParser;

    // resize image based on width and keep the aspect ratio
    // store as buffer to keep server clean from additional file
    if (req.file.size > MAX_IMAGE_SIZE) {
      // @ts-expect-error
      const resized = await sharp(image)
        .resize({
          width: MAX_IMAGE_WIDTH,
        })
        .toBuffer({resolveWithObject: true});

      // format file as string
      file = formatBufferTo64(fileName, resized.data);
    } else {
      file = formatBufferTo64(fileName, image);
    }

    if (!file.content) {
      throw new Error('Failed to parse file');
    }

    try {
      const uploadResult = await cloudinaryUpload(file.content);

      return res.json({url: uploadResult.secure_url});
    } catch (error) {
      console.log('[next-api][upload-image][error]', error);

      throw error;
    }
  });

export default handler;
