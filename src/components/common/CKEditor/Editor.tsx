import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {CKEditor} from '@ckeditor/ckeditor5-react';

import React from 'react';

import {EditorProps} from './Editor.interface';
import {useStyles} from './Editor.style';
import {CustomAdapterPlugin} from './adapters';

import * as UserAPI from 'src/lib/api/user';

export const Editor: React.FC<EditorProps> = props => {
  const {mobile, onChange, isErrorEditor} = props;

  const styles = useStyles({mobile, counter: true});

  const handleSearch = async (query: string) => {
    const {data} = await UserAPI.searchUsers(1, query);

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
    placeholder: 'Type',
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
        types: ['png', 'jpeg', 'webp', 'gif'],
      },
      toolbar: [],
    },
  };

  console.log('isError', isErrorEditor);
  return (
    <div
      className={`${styles.root} ${styles.large}`}
      style={{borderColor: isErrorEditor ? '#FE3333' : '#E0E0E0'}}>
      <CKEditor
        editor={ClassicEditor}
        config={config}
        onReady={editor => {
          editor.plugins.get('FileRepository').on('change:uploadTotal', (e, n, value) => {
            if (value === 0) {
              const data = editor.getData();
              onChange(data, true);
            }
          });
        }}
        onChange={(event, editor) => {
          const data = editor.getData();

          onChange(data, false);
        }}
        onError={(event, editor) => {
          console.error({event, editor});
        }}
      />
    </div>
  );
};

export default Editor;
