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

import { Modal } from '../atoms/Modal';
import { useStyles } from './Settings.styles';

import { sha256 } from 'js-sha256';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';
import { v4 as uuidv4 } from 'uuid';
import { useUserHook } from 'src/hooks/use-user.hook';

const SharingSetting = () => {
  const styles = useStyles();
  const loading = useSelector<RootState>(
    ({ configState: { loading } }) => loading,
  );
  const [tokenValue, setToken] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState({
    isError: false,
    message: '',
  });

  const { currentWallet } = useUserHook();

  const onChangeToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    if (!input.length) {
      setError({ isError: false, message: '' });
    }
    setToken(event.target.value);
  };

  const onClickAddToken = () => {
    const token = uuidv4();
    const tokenHash = sha256(token);
    const first = token.slice(0, 4);
    const second = token.slice(-4);
    const replacement = 'xxxx-xxxx-xxxx-xxxx-xxxxxxxx';
    const disguise = first + replacement + second;
    console.log(tokenHash, disguise);
    setModalOpen(true);

    // TODO create access token on blockchain
    // await createAccessToken(hash, wallet)
    // await APILink.store(disguise, hash)
    setToken(token);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  if (loading)
    return (
      <Grid container justifyContent="center">
        <CircularProgress />
      </Grid>
    );

  return (
    <Paper elevation={0} className={styles.root}>
      <Modal
        title={i18n.t('Token.Modal.Title')}
        subtitle={i18n.t('Token.Modal.Subtitle')}
        onClose={handleClose}
        open={modalOpen}
        className={styles.root}>
        <Typography component="div" variant="h3">
          Token is {tokenValue}
        </Typography>
      </Modal>
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
