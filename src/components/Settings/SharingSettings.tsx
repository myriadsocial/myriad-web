/* eslint-disable jsx-a11y/interactive-supports-focus */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Button,
  TextField,
  Paper,
  Grid,
  CircularProgress,
  Typography,
} from '@material-ui/core';

import { useStyles } from './Settings.styles';

import i18n from 'src/locale';
import { RootState } from 'src/reducers';

const SharingSetting = () => {
  const styles = useStyles();
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

  const onClickAddToken = () => {
    setToken('');
  };

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
