import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

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
    extraPlugins: [CustomAdapterPlugin],
    toolbar: {
      items: [
        'bold',
        'italic',
        'blockQuote',
        'alignment',
        '|',
        'bulletedList',
        'numberedList',
        'indent',
        'outdent',
        'link',
        'imageUpload',
      ],
    },
    alignment: {
      options: ['left', 'right', 'center', 'justify'],
    },
    mention: {
      feeds: [
        {
          marker: '@',
          feed: handleSearch,
        },
      ],
    },
    image: {
      upload: {
        types: ['png', 'jpeg', 'webp', 'gif', 'mp4'],
      },
      toolbar: [],
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
        editor={ClassicEditor}
        config={config}
        onReady={editor => {
          editor.plugins
            .get('FileRepository')
            .on('change:uploadTotal', (e, n, value) => {
              if (value === 0) {
                const data = editor.getData();
                onChange(data, true);
              }
            });
        }}
        onChange={(event, editor) => {
          let data = editor.getData();
          if (uploadedVideos.length !== 0) {
            data =
              data +
              `<video controls src='${uploadedVideos[0]}'>your browser does not support video</video>`;
          }
          setEditorData(data);

          onChange(data, false);
        }}
        onError={(event, editor) => {
          console.error({ event, editor });
        }}
      />

      <Button
        variant="contained"
        color="primary"
        size="small"
        fullWidth
        onClick={handleUploadButtonClick}
        style={{ margin: '10px auto' }}>
        Upload Video
      </Button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 150px)',
          gridGap: '10px',
        }}>
        {uploadedVideos.map((videoURL, index) => (
          <VideoPreview key={index} videoURL={videoURL} />
        ))}
      </div>

      {modalOpen && (
        <MediaEmbedToolbarButton
          userId={userId} // Pass the required props to the MediaEmbedToolbarButton component
          onFileSelected={handleFileSelected}
          modalOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Editor;
