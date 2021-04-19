import type { NextApiRequest, NextApiResponse } from 'next';

import { v2 as cloudinary } from 'cloudinary';

type ResponseImageUpload = {
  url: string;
};

cloudinary.config({
  cloud_name: 'dsget80gs',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const uploadToCloudinary = (file: File) => {
  return new Promise((resolve, reject) => {
    console.log('file', file);
    cloudinary.uploader.upload_stream({});
  });
};

export default async (req: NextApiRequest, res: NextApiResponse<ResponseImageUpload>) => {
  // req.file;
  // const url = await uploadToCloudinary();
  console.log('uploadToCloudinary', uploadToCloudinary);

  res.status(200).json({
    url: ''
  });
};
