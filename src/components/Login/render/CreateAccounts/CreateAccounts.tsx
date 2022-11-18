import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import getConfig from 'next/config';

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@material-ui/core';

import {useStyles} from './CreateAccounts.style';

import useConfirm from 'components/common/Confirm/use-confirm.hook';
import {IcEmail, LogoMyriadCircle} from 'src/images/Icons';
import {signUpWithEmail} from 'src/lib/api/auth-link';
import i18n from 'src/locale';

const {publicRuntimeConfig} = getConfig();
export default function CreateAccounts({email}: {email: string}) {
  const styles = useStyles();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const [isTermApproved, setIsTermApproved] = useState<boolean>(false);

  const toggleTermApproved = () => {
    setIsTermApproved(!isTermApproved);
  };

  const payload = {
    username: userName,
    name: displayName,
    email: email,
    callbackURL: publicRuntimeConfig.appAuthURL + '/login',
  };
  const _handleRegister = async () => {
    const response = await signUpWithEmail(payload);
    if (response) {
      navigate('/magiclink');
    }
  };

  const handleVisitWeb = (url: string) => {
    window.open(publicRuntimeConfig.appAuthURL + url, '_blank', 'noopener,noreferrer');
  };

  const _showModal = () => {
    confirm({
      title: i18n.t('LiteVersion.CreateAccountEmail'),
      description: i18n.t('LiteVersion.CreateAccountEmailDesc'),
      icon: 'warning',
      confirmationText: i18n.t('LiteVersion.Confirm'),
      cancellationText: i18n.t('LiteVersion.Cancel'),
      onConfirm: () => {
        _handleRegister();
      },
      onCancel: () => {
        undefined;
      },
    });
  };

  return (
    <div className={styles.root}>
      <Typography className={styles.textTitle}>Email Used</Typography>
      <div className={styles.wrapperEmail}>
        <IcEmail />
        <Typography className={styles.textEmail}>{email}</Typography>
      </div>
      <Typography className={styles.textTitle}>Selected Federated Instance</Typography>
      <div className={styles.wrapperInstance}>
        <LogoMyriadCircle />
        <div className={styles.wrapperTextInstance}>
          <Typography className={styles.nameInstance}>Myriad Official</Typography>
          <Typography className={styles.desc}>
            A social metaverse & metasocial on web3, pulling content from mainstream social media
            and turning every post into a tipping
          </Typography>
        </div>
      </div>
      <Typography className={styles.textTitle}>Create New Account</Typography>
      <Typography className={styles.textSetUsername}>
        You can only set your username once, and will be unique each instance
      </Typography>
      <div className={styles.wrapperForm}>
        <FormControl fullWidth variant="outlined" style={{marginBottom: 0}}>
          <InputLabel htmlFor="display-name">Display Name</InputLabel>
          <OutlinedInput
            id="username"
            placeholder="Display Name"
            value={displayName}
            labelWidth={90}
            inputProps={{maxLength: 22}}
            onChange={e => setDisplayName(e.target.value)}
          />
        </FormControl>
        <div className={styles.wrapperTextCharacter}>
          <Typography className={styles.textCharacter}>
            You can use {22 - displayName.length} or more characters.
          </Typography>
          <Typography className={styles.textCharacter}>{displayName.length}/22</Typography>
        </div>
      </div>
      <div className={styles.wrapperForm}>
        <FormControl fullWidth variant="outlined" style={{marginBottom: 0}}>
          <InputLabel htmlFor="display-name">Username</InputLabel>
          <OutlinedInput
            id="username"
            placeholder="Username"
            value={userName}
            labelWidth={70}
            inputProps={{maxLength: 16}}
            onChange={e => setUserName(e.target.value)}
          />
        </FormControl>
        <div className={styles.wrapperTextCharacter}>
          <Typography className={styles.textCharacter}>
            You can use {16 - userName.length} or more characters.
          </Typography>
          <Typography className={styles.textCharacter}>{userName.length}/16</Typography>
        </div>
        <Grid container direction="column" className={styles.condition}>
          <FormControlLabel
            className={styles.termControl}
            onChange={toggleTermApproved}
            control={<Checkbox name="term" color="primary" className={styles.checkbox} />}
            label={
              <Typography style={{color: '#0A0A0A'}}>
                {i18n.t('Login.Options.Text_Terms_1')}&nbsp;
                <Typography
                  component={'a'}
                  className={styles.term}
                  onClick={() => handleVisitWeb('/term-of-use')}>
                  {i18n.t('Login.Options.Text_Terms_2')}
                </Typography>
                &nbsp;{i18n.t('Login.Options.Text_Terms_3')}&nbsp;
                <Typography
                  component={'a'}
                  className={styles.term}
                  onClick={() => handleVisitWeb('/privacy-policy')}>
                  {i18n.t('Login.Options.Text_Terms_4')}
                </Typography>
              </Typography>
            }
          />
        </Grid>
        <div style={{display: 'flex'}}>
          <Button variant="outlined" fullWidth color="secondary" onClick={() => navigate('/email')}>
            Back
          </Button>
          <div style={{width: 8}} />
          <Button
            disabled={!isTermApproved || userName.length === 0 || displayName.length === 0}
            variant="contained"
            fullWidth
            color="primary"
            onClick={_showModal}>
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
