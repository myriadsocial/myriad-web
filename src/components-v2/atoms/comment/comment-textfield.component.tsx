import React from 'react';

import {Tooltip} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CropOriginalRoundedIcon from '@material-ui/icons/CropOriginalRounded';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import VideoCallOutlinedIcon from '@material-ui/icons/VideoCallOutlined';

import {useStyles} from './comment-textfield.style';

type Props = {
  onSubmit: (comment: string) => void;
};

export const CommentTextFieldComponent: React.FC<Props> = ({onSubmit}) => {
  const style = useStyles();
  const CHARACTER_LIMIT = 2000;

  const [comment, setValues] = React.useState({
    text: '',
  });

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
    <div style={{display: 'flex'}}>
      <Avatar style={{marginRight: 12}} src={''}>
        {'A'}
      </Avatar>
      <div className={style.root}>
        <TextareaAutosize
          rowsMin={1}
          value={comment.text}
          placeholder="Write a Comment..."
          className={style.write}
          onChange={handleChange('text')}
          spellCheck={false}
          maxLength={CHARACTER_LIMIT}
        />
        <CardActions disableSpacing>
          <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
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
      </div>
    </div>
  );
};
