import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

import ffmpeg from 'fluent-ffmpeg';
import {v4 as uuid} from 'uuid';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const convert = (filePath: string): Promise<string> => {
  const id = uuid();
  const convertedFilePath = `/tmp/${id}.mp4`;

  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .videoCodec('libx264')
      .audioCodec('libmp3lame')
      .format('mp4')
      .on('error', err => {
        console.log('[video][convert][error]: ' + err.message);
        reject(err);
      })
      .on('end', () => {
        resolve(convertedFilePath);
      })
      .saveToFile(convertedFilePath);
  });
};
