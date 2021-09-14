import {action} from '@storybook/addon-actions';

import React, {useState} from 'react';

import {IconButton} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
// TODO move icon to HEROICONS
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import {acronym} from '../../helpers/string';
import {Props} from './richText.interface';
import {useStyles} from './richtext.style';

export const RichTextComponent: React.FC<Props> = props => {
  const {userProfilePict} = props;
  const style = useStyles();
  const [post, setPost] = useState<string>('');

  const updatePostText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setPost(text);
  };

  return (
    <div className={style.root}>
      <div className={style.flex}>
        <div className={style.flex}>
          <Avatar
            aria-label={`avatar`}
            src={userProfilePict}
            variant="circular"
            sizes="lg"
            style={{width: 50, height: 50}}>
            {acronym('User Name')}
          </Avatar>
          <TextareaAutosize
            rowsMin={1}
            value={post}
            placeholder={`Whats on your mind?`}
            className={style.postTextArea}
            onChange={updatePostText}
            spellCheck={false}
          />
        </div>
        <IconButton color="primary" size="medium" className={style.action}>
          <AddCircleOutlineIcon fontSize="large" color="primary" />
        </IconButton>
      </div>
      <div
        onClick={action('open modal')}
        role="button"
        tabIndex={0}
        aria-hidden="true"
        className={style.screen}
      />
    </div>
  );
};
