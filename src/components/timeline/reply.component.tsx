import React from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    postAction: {
      marginTop: theme.spacing(1)
    },
    write: {
      backgroundColor: '#171717',
      borderRadius: theme.spacing(1),
      '& .MuiFormHelperText-root': {
        textAlign: 'right',
        borderColor: 'rgba(255, 255, 255, 0.23)',
        border: '1px solid',
        borderTop: 0,
        padding: '0 14px',
        margin: 0,
        borderRadius: 8
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderBottom: 0
      }
    }
  })
);

type Props = {
  close: () => void;
};

export default function ReplyComponent({ close }: Props) {
  const classes = useStyles();

  const CHARACTER_LIMIT = 300;
  const [values, setValues] = React.useState({
    text: ''
  });

  const handleChange = text => event => {
    setValues({ ...values, [text]: event.target.value });
  };

  const discard = () => {
    setValues({ ...values, text: '' });
  };

  return (
    <>
      <TextField
        inputProps={{
          maxLength: CHARACTER_LIMIT
        }}
        helperText={`${values.text.length}/${CHARACTER_LIMIT}`}
        value={values.text}
        multiline
        variant="outlined"
        className={classes.write}
        rows={4}
        fullWidth={true}
        onChange={handleChange('text')}
        placeholder="Type your comment here"
      />
      <Grid className={classes.postAction} container direction="row" justify="space-between" alignItems="center">
        <Grid item>
          <IconButton aria-label="hide" size="small" onClick={close} color="secondary">
            <ExpandLessIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <Button variant="contained" color="default" size="small" onClick={discard}>
            Discard
          </Button>
          <Button variant="contained" color="primary" size="small">
            Send
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
