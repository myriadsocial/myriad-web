import React from 'react';

import { useSession } from 'next-auth/client';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import LoginComponent from '../../login/login.component';
import LoginOverlayComponent from '../../login/overlay.component';
import { useStyles } from './reply.style';

import ShowIf from 'src/components/common/show-if.component';

type Props = {
  close: () => void;
  onSubmit: (comment: string) => void;
};

export default function ReplyComponent({ close, onSubmit }: Props) {
  const style = useStyles();
  const [session] = useSession();
  const [loginOpened, openLogin] = React.useState(false);

  const CHARACTER_LIMIT = 300;
  const [comment, setValues] = React.useState({
    text: ''
  });

  const toggleLogin = () => {
    openLogin(!loginOpened);
  };

  const handleChange = (text: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...comment, [text]: event.target.value });
  };

  const discard = () => {
    setValues({ ...comment, text: '' });
  };

  const reply = () => {
    onSubmit(comment.text);
    discard();
  };

  return (
    <div className={style.root}>
      <TextField
        inputProps={{
          maxLength: CHARACTER_LIMIT
        }}
        helperText={`${comment.text.length}/${CHARACTER_LIMIT}`}
        value={comment.text}
        multiline
        variant="outlined"
        className={style.write}
        rows={4}
        fullWidth={true}
        onChange={handleChange('text')}
        placeholder="Type your comment here"
      />
      <ShowIf condition={!!session && !!session?.user.anonymous}>
        <LoginOverlayComponent toggleLogin={toggleLogin} />
      </ShowIf>

      <ShowIf condition={!session?.user.anonymous}>
        <Grid className={style.postAction} container direction="row" justify="space-between" alignItems="center">
          <Grid item>
            <IconButton aria-label="hide" size="small" onClick={close} color="secondary">
              <ExpandLessIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Button variant="contained" color="default" size="small" onClick={discard}>
              Discard
            </Button>
            <Button variant="contained" color="primary" size="small" onClick={reply}>
              Send
            </Button>
          </Grid>
        </Grid>
      </ShowIf>

      <Dialog open={loginOpened} onClose={toggleLogin} maxWidth="xs">
        <LoginComponent allowAnonymous={false} />
      </Dialog>
    </div>
  );
}
