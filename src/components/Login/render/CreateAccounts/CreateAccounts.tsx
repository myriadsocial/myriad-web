import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import Link from 'next/link';

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

import {IcEmail, LogoMyriadCircle} from 'src/images/Icons';
import i18n from 'src/locale';

export default function CreateAccounts() {
  const styles = useStyles();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const [termApproved, setTermApproved] = useState(false);

  const toggleTermApproved = () => {
    setTermApproved(!termApproved);
  };

  return (
    <div className={styles.root}>
      <Typography className={styles.textTitle}>Email Used</Typography>
      <div className={styles.wrapperEmail}>
        <IcEmail />
        <Typography className={styles.textEmail}>Hello@gmail.com</Typography>
      </div>
      <Typography className={styles.textTitle}>Selected Instance</Typography>
      <div className={styles.wrapperInstance}>
        <LogoMyriadCircle />
        <div className={styles.wrapperTextInstance}>
          <Typography className={styles.nameInstance}>Myriad</Typography>
          <Typography className={styles.desc}>
            Metaverse hunter for all. Join us to get more metaverse hun...
          </Typography>
          <Typography className={styles.textSeeMore}>See more</Typography>
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
                <Link href="/term-of-use" passHref>
                  <Typography component={'a'} className={styles.term}>
                    {i18n.t('Login.Options.Text_Terms_2')}
                  </Typography>
                </Link>
                &nbsp;{i18n.t('Login.Options.Text_Terms_3')}&nbsp;
                <Link href="/privacy-policy" passHref>
                  <Typography component={'a'} className={styles.term}>
                    {i18n.t('Login.Options.Text_Terms_4')}
                  </Typography>
                </Link>
              </Typography>
            }
          />
        </Grid>
        <div style={{display: 'flex'}}>
          <Button variant="outlined" fullWidth color="secondary" onClick={() => navigate('/')}>
            Back
          </Button>
          <div style={{width: 8}} />
          <Button variant="contained" fullWidth color="primary" onClick={() => undefined}>
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
