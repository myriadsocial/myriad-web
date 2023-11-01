/* eslint-disable jsx-a11y/interactive-supports-focus */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import { XIcon } from '@heroicons/react/outline';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import getConfig from 'next/config';
import { useRouter } from 'next/router';

import {
  Button,
  TextField,
  Paper,
  IconButton,
  SvgIcon,
  Grid,
  CircularProgress,
  Typography,
} from '@material-ui/core';

import { useStyles } from './Settings.styles';

import { PromptComponent } from 'src/components/atoms/Prompt/prompt.component';
import { useUserHook } from 'src/hooks/use-user.hook';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';
import {
  sendVerificationEmail,
  updateEmail,
  deleteEmail,
} from 'src/reducers/config/actions';
import validator from 'validator';

const { publicRuntimeConfig } = getConfig();
const countDownTime = 60;

const SharingSetting = () => {
  const styles = useStyles();
  const { query, push } = useRouter();
  const dispatch = useDispatch();
  const loading = useSelector<RootState>(
    ({ configState: { loading } }) => loading,
  );
  const [tokenValue, setToken] = useState('');
  const [error, setError] = useState({
    isError: false,
    message: '',
  });

  const onChangeToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    if (!input.length) {
      setError({ isError: false, message: '' });
    }
    setToken(event.target.value);
  };

  const onClickAddToken = () => {};

  if (loading)
    return (
      <Grid container justifyContent="center">
        <CircularProgress />
      </Grid>
    );

  return (
    <Paper elevation={0} className={styles.root}>
      <Typography className={styles.subtitle}>Input Code Here</Typography>
      <div
        className={styles.option}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <>
          <TextField
            variant="outlined"
            fullWidth
            label={i18n.t('Setting.List_Menu.Token_Code')}
            placeholder={i18n.t('Setting.List_Menu.Token_Code')}
            value={tokenValue}
            style={{ marginBottom: 'unset' }}
            onChange={onChangeToken}
            error={error.isError}
            helperText={error.isError ? error.message : ''}
          />
          <Button
            size="small"
            variant="contained"
            color="primary"
            style={{ marginLeft: '24px', marginRight: '17px' }}
            onClick={onClickAddToken}>
            Add
          </Button>
        </>
      </div>
      <div>
        <Button
          size="medium"
          variant="contained"
          color="primary"
          style={{ marginLeft: '24px', marginRight: '17px', marginTop: '15px' }}
          onClick={onClickAddToken}>
          Generate Token
        </Button>
      </div>
    </Paper>
  );
};

export default SharingSetting;
