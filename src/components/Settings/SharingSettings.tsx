/* eslint-disable jsx-a11y/interactive-supports-focus */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Button,
  Paper,
  Grid,
  CircularProgress,
  Typography,
} from '@material-ui/core';

import { Modal } from '../atoms/Modal';
import { useStyles } from './Settings.styles';

import { sha256 } from 'js-sha256';
import { useUserHook } from 'src/hooks/use-user.hook';
import * as AccessTokenAPI from 'src/lib/api/access-token';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';
import { v4 as uuidv4 } from 'uuid';

const SharingSetting = () => {
  const styles = useStyles();
  const loading = useSelector<RootState>(
    ({ configState: { loading } }) => loading,
  );
  const [tokenValue, setToken] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const onClickAddToken = async () => {
    const token = uuidv4();
    const tokenHash = sha256(token);
    const first = token.slice(0, 4);
    const second = token.slice(-4);
    const replacement = 'xxxx-xxxx-xxxx-xxxx-xxxxxxxx';
    const disguise = first + replacement + second;
    console.log(tokenHash, disguise);
    try {
      await AccessTokenAPI.postToken(tokenHash, disguise);
      setModalOpen(true);
    } catch (error) {
      console.error(error);
    }

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
