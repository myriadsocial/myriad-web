import React, { useState } from 'react';

import { Upload } from 'components/Upload';
import { Modal } from 'components/atoms/Modal';
import * as UploadAPI from 'src/lib/api/upload';
import i18n from 'src/locale';

export const MediaEmbedToolbarButton = ({
  userId,
  onFileSelected,
  modalOpen,
  ...props
}) => {
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(modalOpen ?? false);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      const { files: uploadedFiles } = await UploadAPI.videoMobile(files[0], {
        onUploadProgress: (event: ProgressEvent) => {
          const total = Math.round((100 * event.loaded) / event.total);

          setProgress(total);
        },
      });

      onFileSelected(uploadedFiles);

      setProgress(0);
      setOpen(false);
    } catch (error) {
      console.error('ERROR', error);
    }
  };

  return (
    <Modal
      title={i18n.t('Post_Create.Upload.Video.Title')}
      align="left"
      titleSize="small"
      maxWidth="xl"
      open={open}
      onClose={() => setOpen(false)}>
      <Upload
        type="video"
        progress={progress}
        loading={progress > 0}
        onFileSelected={handleFileSelected}
        accept={['video/mp4', 'video/x-m4v', 'video/*']}
        maxSize={210}
        placeholder={i18n.t('Post_Create.Upload.Video.Placeholder')}
        usage="post"
      />
    </Modal>
  );
};
