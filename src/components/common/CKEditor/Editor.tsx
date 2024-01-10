import { CKEditor } from '@ckeditor/ckeditor5-react';
import customEditor from '@myriadsocial/ckeditor5-custom-build';

import React, { useState } from 'react';

import { EditorProps } from './Editor.interface';
import { useStyles } from './Editor.style';

import * as UserAPI from 'src/lib/api/user';

export const Editor: React.FC<EditorProps> = props => {
  const { mobile, onChange, isErrorEditor, placeholder } = props;

  const styles = useStyles({ mobile, counter: true });
  const [, setEditorData] = useState('');

  const handleSearch = async (query: string) => {
    const { data } = await UserAPI.searchUsers(1, query);

    return data.map(item => {
      return {
        id: '@' + item.username,
        userId: item.id,
        name: item.username,
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

  return (
    <div
      className={`${styles.root} ${styles.large}`}
      style={{ borderColor: isErrorEditor ? '#FE3333' : '#E0E0E0' }}>
      <CKEditor
        editor={customEditor}
        config={config}
        onReady={editor => {
          console.log('Editor is ready');
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
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
