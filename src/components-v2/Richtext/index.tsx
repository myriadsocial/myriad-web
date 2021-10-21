import {PlusCircleIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import {IconButton} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import SvgIcon from '@material-ui/core/SvgIcon';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import {acronym} from '../../helpers/string';
import {Props} from './richText.interface';
import {useStyles} from './richtext.style';

export const RichTextComponent: React.FC<Props> = props => {
  const {userProfilePict, onOpenCreatePost, alias} = props;
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
            {acronym(alias || 'User')}
          </Avatar>
          <TextareaAutosize
            minRows={1}
            value={post}
            placeholder={`What's on your mind?`}
            className={style.postTextArea}
            onChange={updatePostText}
            spellCheck={false}
          />
        </div>
        <IconButton color="primary" size="medium" className={style.action}>
          <SvgIcon classes={{root: style.fill}} component={PlusCircleIcon} viewBox="0 0 24 24" />
        </IconButton>
      </div>
      <div
        onClick={onOpenCreatePost}
        role="button"
        tabIndex={0}
        aria-hidden="true"
        className={style.screen}
      />
    </div>
  );
};
