import React, {useEffect, useState} from 'react';

import {Typography} from '@material-ui/core';

import ShowIf from 'components/common/show-if.component';
import {detect} from 'detect-browser';
import muxjs from 'mux.js';
import i18n from 'src/locale';

type PreviewVideoProps = {
  files: File[];
};

export const Video: React.FC<PreviewVideoProps> = props => {
  const {files} = props;

  const [previews, setPreviews] = useState<
    Array<{
      url: string;
      codecSupported: boolean;
    }>
  >([]);

  const codecSupported =
    previews.filter(preview => preview.codecSupported).length === previews.length;

  useEffect(() => {
    validateFiles();
  }, [files]);

  const validateFiles = async () => {
    for (const file of files) {
      const codecSupported = await checkCodec(file);
      const url = URL.createObjectURL(file);

      setPreviews(prev => [...prev, {codecSupported, url}]);
    }
  };

  const checkCodec = async (file: File): Promise<boolean> => {
    let supported = false;

    const raw = await readFile(file);

    if (raw !== null && typeof raw !== 'string') {
      const data = new Uint8Array(raw);
      const [video] = muxjs.mp4.probe.tracks(data);

      // browser codec name for HEVC (H.265)
      if (video?.codec === 'hvc1') {
        const browser = detect();
        supported = browser !== null && !['firefox', 'chrome'].includes(browser.name);
      } else {
        supported = true;
      }
    }

    return supported;
  };

  const readFile = (file: File): Promise<ArrayBuffer | string | null> => {
    return new Promise((resolve, reject) => {
      // Create file reader
      const reader = new FileReader();

      // Register event listeners
      reader.addEventListener('loadend', e => resolve(e.target?.result || null));
      reader.addEventListener('error', reject);

      // Read file
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <>
      <ShowIf condition={!codecSupported}>
        <Typography>{i18n.t('Dropzone.Video.Not_Preview')}</Typography>
      </ShowIf>
      <ShowIf condition={codecSupported}>
        {previews.map((item, i) => (
          <video key={i} controls style={{width: '100%'}}>
            <track kind="captions" />
            <source src={item.url} type="video/mp4" />
            <div>{i18n.t('Dropzone.Video.Not_Support')}</div>
          </video>
        ))}
      </ShowIf>
    </>
  );
};

export default Video;
