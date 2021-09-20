import React from 'react';

import {Tooltip} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
// TODO move icon to HEROICONS
import CropOriginalRoundedIcon from '@material-ui/icons/CropOriginalRounded';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import VideoCallOutlinedIcon from '@material-ui/icons/VideoCallOutlined';

import {acronym} from '../../../helpers/string';
import {useStyles} from './CommentEditor.style';

type Props = {
  onSubmit: (comment: string) => void;
  username: string;
  avatar: string;
  placeholder?: string;
};

export const CommentEditor: React.FC<Props> = props => {
  const {onSubmit, username, avatar, placeholder} = props;
  const style = useStyles();
  const CHARACTER_LIMIT = 2000;
  const [toggle, setToggle] = React.useState<boolean>(false);

  const [comment, setValues] = React.useState({
    text: '',
  });

  const openComment = () => setToggle(true);

  const handleChange = (text: string) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues({...comment, [text]: event.target.value.substring(0, CHARACTER_LIMIT)});
  };

  const discard = () => {
    setValues({...comment, text: ''});
  };

  const reply = () => {
    onSubmit(comment.text);
    discard();
  };

  return (
    <div className={style.flex}>
      <Avatar className={style.avatar} src={avatar || ''}>
        {acronym(username)}
      </Avatar>
      <div className={style.root}>
        <TextareaAutosize
          onClick={openComment}
          rowsMin={1}
          value={comment.text}
          placeholder={placeholder || 'Write a Comment...'}
          className={style.write}
          onChange={handleChange('text')}
          spellCheck={false}
          maxLength={CHARACTER_LIMIT}
        />
        {toggle && (
          <CardActions disableSpacing>
            <div className={style.container}>
              <div>
                <Tooltip title="Coming soon" arrow>
                  <IconButton className={style.action} aria-label="reply">
                    <CropOriginalRoundedIcon color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Coming soon" arrow>
                  <IconButton className={style.action} aria-label="reply">
                    <VideoCallOutlinedIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </div>
              <IconButton
                aria-label="reply"
                disabled={comment.text.length === 0}
                onClick={reply}
                className={style.action}>
                <SendRoundedIcon className={style.replyIcon} />
              </IconButton>
            </div>
          </CardActions>
        )}
      </div>
    </div>
  );
};
