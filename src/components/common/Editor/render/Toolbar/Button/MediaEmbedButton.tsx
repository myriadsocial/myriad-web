import {usePlateEditorRef} from '@udecode/plate-core';
import {insertMediaEmbed} from '@udecode/plate-media-embed';
import {ToolbarButton, ToolbarButtonProps} from '@udecode/plate-ui-toolbar';

import React, {useState} from 'react';

import {Upload} from 'components/Upload';
import {Modal} from 'components/atoms/Modal';
import {useToggle} from 'src/hooks/use-toggle.hook';
import * as UploadAPI from 'src/lib/api/upload';
import i18n from 'src/locale';

export interface MediaEmbedToolbarButtonProps extends ToolbarButtonProps {
  userId: string;
}

export const MediaEmbedToolbarButton = ({id, userId, ...props}: MediaEmbedToolbarButtonProps) => {
  const editor = usePlateEditorRef(id)!;

  const [progress, setProgress] = useState(0);
  const [open, toggleUploadDialog] = useToggle(false);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      const {files: uploadedFiles} = await UploadAPI.video(files[0], {
        onUploadProgress: (event: ProgressEvent) => {
          const total = Math.round((100 * event.loaded) / event.total);

          setProgress(total);
        },
      });

      if (uploadedFiles.length > 0) {
        insertMediaEmbed(editor, {url: uploadedFiles[0].url});
      }

      setProgress(0);
      toggleUploadDialog();
    } catch (error) {
      console.error('ERROR', error);
    }
  };

  return (
    <>
      <ToolbarButton
        onMouseDown={async event => {
          if (!editor) return;

          event.preventDefault();

          toggleUploadDialog();
        }}
        {...props}
      />

      <Modal
        title={i18n.t('Post_Create.Upload.Video.Title')}
        align="left"
        titleSize="small"
        maxWidth="xl"
        open={open}
        onClose={toggleUploadDialog}>
        <Upload
          type="video"
          progress={progress}
          loading={progress > 0}
          onFileSelected={handleFileSelected}
          accept={['video/mp4', 'video/x-m4v', 'video/*']}
          maxSize={100}
          placeholder={i18n.t('Post_Create.Upload.Video.Placeholder')}
          usage="post"
        />
      </Modal>
    </>
  );
};
