import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {CKEditor} from '@ckeditor/ckeditor5-react';

import React from 'react';

import {EditorProps} from './Editor.interface';
import {useStyles} from './Editor.style';

import clsx from 'clsx';
import * as UserAPI from 'src/lib/api/user';

export const BasicEditor: React.FC<EditorProps & {initial?: string}> = props => {
  const {initial = '', mobile, children, placeholder, onChange, onReady} = props;

  const styles = useStyles({mobile, counter: true});

  const handleSearch = async (query: string) => {
    const {data} = await UserAPI.searchUsers(1, query);

    return data.map(item => ({
      id: '@' + item.username,
      userId: item.id,
      name: item.name,
    }));
  };

  const config = {
    licenseKey: '',
    placeholder,
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
    toolbar: {
      items: [],
    },
  };

  return (
    <div
      className={clsx({
        [styles.root]: true,
        [styles.mobile]: true,
      })}>
      <CKEditor
        editor={ClassicEditor}
        config={config}
        data={initial}
        onReady={editor => {
          onReady(editor);
        }}
        onChange={(_, editor) => {
          const data = editor.getData();
          onChange(data, false);
        }}
        onError={(event, editor) => {
          console.error({event, editor});
        }}
      />

      <div className={styles.action}>{children}</div>
    </div>
  );
};

export default BasicEditor;
