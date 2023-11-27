import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import customEditor from 'ckeditor5/build/ckeditor';

import React, { useState } from 'react';

import { Button } from '@material-ui/core';

import { EditorProps } from './Editor.interface';
import { useStyles } from './Editor.style';
import { MediaEmbedToolbarButton } from './MediaEmbedButton';
import { CustomAdapterPlugin } from './adapters';

import * as UserAPI from 'src/lib/api/user';

type File = {
  originalname: string;
  mimeType: string;
  size: number;
  url: string;
};
const VideoPreview = ({ videoURL }) => {
  return (
    <div style={{ width: '150px', height: 'auto', margin: '10px' }}>
      <video
        controls
        style={{ width: '150px', height: 'auto', maxHeight: '75px' }}>
        <source src={videoURL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export const Editor: React.FC<EditorProps> = props => {
  const { userId, mobile, onChange, isErrorEditor, placeholder } = props;

  const styles = useStyles({ mobile, counter: true });
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [editorData, setEditorData] = useState('');
  const handleUploadButtonClick = () => {
    setModalOpen(true);
  };

  const handleSearch = async (query: string) => {
    const { data } = await UserAPI.searchUsers(1, query);

    return data.map(item => {
      return {
        id: '@' + item.username,
        userId: item.id,
        name: item.name,
      };
    });
  };

  const config = {
    licenseKey: '',
    placeholder: placeholder ?? 'Type...',
    // toolbar: {
    //   items: [
    //     'bold',
    //     'italic',
    //     'blockQuote',
    //     'alignment',
    //     '|',
    //     'bulletedList',
    //     'numberedList',
    //     'indent',
    //     'outdent',
    //     'link',
    //     'imageUpload',
    //   ],
    // },
    mention: {
      feeds: [
        {
          marker: '@',
          feed: handleSearch,
        },
      ],
    },
  };

  const handleFileSelected = (uploadedVideosData: File[]) => {
    const videoURL = uploadedVideosData[0].url; // Assuming you only upload one video at a time

    setUploadedVideos([...uploadedVideos, videoURL]);
    setModalOpen(false);
    const dataWithVideo =
      editorData +
      `<video controls src='${videoURL}'>your browser does not support video</video>`;
    onChange(dataWithVideo, false);
  };

  return (
    <div
      className={`${styles.root} ${styles.large}`}
      style={{ borderColor: isErrorEditor ? '#FE3333' : '#E0E0E0' }}>
      <CKEditor
        editor={customEditor}
        config={config}
        onReady={editor => {
          console.log("Editor is ready")
        }}
        onChange={(event, editor) => {
          let data = editor.getData();
          setEditorData(data);

          onChange(data, false);
        }}
        onError={(event, editor) => {
          console.error({ event, editor });
        }}
      />
    </div>
  );
};

export default Editor;
