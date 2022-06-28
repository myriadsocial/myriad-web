import {PlusCircleIcon} from '@heroicons/react/outline';

import React, {useContext, useState} from 'react';

import {IconButton} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import SvgIcon from '@material-ui/core/SvgIcon';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import {acronym} from '../../helpers/string';
import {Props} from './richText.interface';
import {useStyles} from './richtext.style';

import {AuthorizationContext} from 'components/common/Authorization/Authorization.context';

export const RichTextComponent: React.FC<Props> = props => {
  const {userProfilePict, onOpenCreatePost, alias, name, placeholder} = props;

  const authorization = useContext(AuthorizationContext);

  const style = useStyles();
  const [post, setPost] = useState<string>('');

  const updatePostText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;

    setPost(text);
  };

  const openPostCreateDialog = () => {
    if (authorization.authorized) {
      onOpenCreatePost();
    } else {
      authorization.alert();
    }
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
            className={style.avatar}>
            {acronym(name || alias || '')}
          </Avatar>
          <TextareaAutosize
            minRows={1}
            value={post}
            placeholder={placeholder}
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
        onClick={openPostCreateDialog}
        role="button"
        tabIndex={0}
        aria-hidden="true"
        className={style.screen}
      />
    </div>
  );
};
