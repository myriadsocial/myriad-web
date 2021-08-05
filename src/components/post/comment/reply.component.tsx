import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import SendIcon from '@material-ui/icons/Send';

import {useStyles} from './reply.style';

import ShowIf from 'src/components/common/show-if.component';
import LoginOverlayComponent from 'src/components/login/overlay.component';

type Props = {
  isAnonymous: boolean;
  close: () => void;
  onSubmit: (comment: string) => void;
};

const CHARACTER_LIMIT = 2000;

export default function ReplyComponent({isAnonymous, close, onSubmit}: Props) {
  const style = useStyles();

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
    <div className={style.root}>
      <ShowIf condition={!isAnonymous}>
        <TextareaAutosize
          rowsMin={2}
          value={comment.text}
          placeholder="Write a Comment..."
          className={style.write}
          onChange={handleChange('text')}
          spellCheck={false}
        />

        <IconButton
          aria-label="reply"
          className={style.reply}
          disableTouchRipple
          disableFocusRipple
          disableRipple
          disabled={comment.text.length === 0}
          onClick={reply}>
          <SendIcon className={style.replyIcon} />
        </IconButton>
      </ShowIf>

      <ShowIf condition={isAnonymous}>
        <TextField multiline variant="outlined" className={style.write} rows={8} fullWidth={true} />
        <LoginOverlayComponent />
      </ShowIf>
    </div>
  );
}
