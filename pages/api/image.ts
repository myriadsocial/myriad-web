//@ts-ignore
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { v2 as cloudinary } from 'cloudinary';
import DatauriParser from 'datauri/parser';
import multer from 'multer';
import path from 'path';

type ResponseImageUpload = {
  url?: string;
  error?: string;
};

// Multer config
const storage = multer.memoryStorage();
const upload = multer({
  storage
});

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

//@ts-ignore
const cloudinaryUpload = (file: any) => cloudinary.uploader.upload(file);

//@ts-ignore
const formatBufferTo64 = (file: any) => {
  const parser = new DatauriParser();

  return parser.format(path.extname(file.originalname).toString(), file.buffer);
};

export const config = {
  api: {
    bodyParser: false
  }
};

//@ts-ignore
const handler = nextConnect()
  .use(upload.single('image'))
  .post(async (req: any, res: NextApiResponse<ResponseImageUpload>) => {
    const file = formatBufferTo64(req.file);

    const uploadResult = await cloudinaryUpload(file.content);

    return res.json({ url: uploadResult.secure_url });
  });

export default handler;
