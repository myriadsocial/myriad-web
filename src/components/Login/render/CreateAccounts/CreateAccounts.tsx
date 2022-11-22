import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

import getConfig from 'next/config';

import {Button, Checkbox, FormControlLabel, Grid, TextField, Typography} from '@material-ui/core';

import {useStyles} from './CreateAccounts.style';

import useConfirm from 'components/common/Confirm/use-confirm.hook';
import useMobileDetect from 'src/hooks/use-is-mobile-detect';
import {IcEmail, LogoMyriadCircle} from 'src/images/Icons';
import {signUpWithEmail} from 'src/lib/api/auth-link';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';

const USERNAME_MAX_LENGTH = 16;
const USERNAME_MIN_LENGTH = 3;
const DISPLAY_NAME_MAX_LENGTH = 22;
const DISPLAY_NAME_MIN_LENGTH = 2;
const NAME_HELPER_TEXT = i18n.t('Login.Profile.Helper_Text_Name', {
  min_length: DISPLAY_NAME_MIN_LENGTH,
});
const USERNAME_HELPER_TEXT = i18n.t('Login.Profile.Helper_Text_Username', {
  min_length: USERNAME_MIN_LENGTH,
});
const {publicRuntimeConfig} = getConfig();

type ProfileProps = {
  checkUsernameAvailability: (username: string, callback: (available: boolean) => void) => void;
  email: string;
};
export default function CreateAccounts(props: ProfileProps) {
  const detect = useMobileDetect();

  const styles = useStyles(detect.isMobile())();
  const {checkUsernameAvailability, email} = props;
  const confirm = useConfirm();
  const navigate = useNavigate();
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);

  const [profile, setProfile] = useState({
    name: {
      value: '',
      error: false,
      helper: NAME_HELPER_TEXT,
    },
    username: {
      value: '',
      error: false,
      helper: USERNAME_HELPER_TEXT,
    },
  });
  const [isTermApproved, setIsTermApproved] = useState<boolean>(false);

  const toggleTermApproved = () => {
    setIsTermApproved(!isTermApproved);
  };

  const payload = {
    username: profile.username.value,
    name: profile.name.value,
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
    const valid = validate();
    if (valid) {
      checkUsernameAvailability(profile.username.value, available => {
        if (available) {
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
        } else {
          setProfile(prevProfile => ({
            ...prevProfile,
            username: {
              ...prevProfile.username,
              error: true,
              helper: i18n.t('Login.Profile.Helper_Validate_Username_Taken'),
            },
          }));
        }
      });
    }
  };

  useEffect(() => {
    let nameHelper = i18n.t('Login.Profile.Helper_Text_Name', {
      min_length: DISPLAY_NAME_MIN_LENGTH,
    });
    let usernameHelper = i18n.t('Login.Profile.Helper_Text_Username', {
      min_length: USERNAME_MIN_LENGTH,
    });

    if (profile.name.value && profile.name.value.length < DISPLAY_NAME_MIN_LENGTH) {
      nameHelper = i18n.t('Login.Profile.Helper_Validate_Name_Min', {
        min_length: DISPLAY_NAME_MIN_LENGTH,
      });
    } else {
      const valid = /^([^"'*\\]*)$/.test(profile.name.value);
      if (!valid) nameHelper = i18n.t('Login.Profile.Helper_Validate_Name_Char');
    }

    if (profile.username.value && profile.username.value.length < USERNAME_MIN_LENGTH) {
      usernameHelper = i18n.t('Login.Profile.Helper_Validate_Username_Min', {
        min_length: USERNAME_MIN_LENGTH,
      });
    } else {
      const valid = /^[a-zA-Z0-9]+$/.test(profile.username.value);
      if (!valid) usernameHelper = i18n.t('Login.Profile.Helper_Validate_Username_Char');
    }

    setProfile(prevSetting => ({
      name: {
        ...prevSetting.name,
        helper: nameHelper,
      },
      username: {
        ...prevSetting.username,
        helper: usernameHelper,
      },
    }));
  }, [settings.language]);

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;

    setProfile(prevProfile => ({
      ...prevProfile,
      name: {
        ...prevProfile.name,
        value: name.trim().replace(/\s\s+/g, ' '),
      },
    }));
  };

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    let username = event.target.value;

    username = username.toLowerCase();

    setProfile(prevProfile => ({
      ...prevProfile,
      username: {
        ...prevProfile.username,
        value: username.trim(),
      },
    }));
  };

  const validateName = (): boolean => {
    let error = false;

    if (!profile.name.value || profile.name.value.length < DISPLAY_NAME_MIN_LENGTH) {
      error = true;

      setProfile(prevSetting => ({
        ...prevSetting,
        name: {
          ...prevSetting.name,
          error: true,
          helper: i18n.t('Login.Profile.Helper_Validate_Name_Min', {
            min_length: DISPLAY_NAME_MIN_LENGTH,
          }),
        },
      }));
    } else {
      const valid = /^([^"'*\\]*)$/.test(profile.name.value);

      if (!valid) {
        error = true;

        setProfile(prevSetting => ({
          ...prevSetting,
          name: {
            ...prevSetting.name,
            error: true,
            helper: i18n.t('Login.Profile.Helper_Validate_Name_Char'),
          },
        }));
      } else {
        error = false;

        setProfile(prevSetting => ({
          ...prevSetting,
          name: {
            ...prevSetting.name,
            error: false,
            helper: NAME_HELPER_TEXT,
          },
        }));
      }
    }

    return !error;
  };

  const validateUsername = (): boolean => {
    let error = false;

    if (!profile.username.value || profile.username.value.length < USERNAME_MIN_LENGTH) {
      error = true;

      setProfile(prevSetting => ({
        ...prevSetting,
        username: {
          ...prevSetting.username,
          error,
          helper: i18n.t('Login.Profile.Helper_Validate_Username_Min', {
            min_length: USERNAME_MIN_LENGTH,
          }),
        },
      }));
    } else {
      // only allow alphanumeric char
      const valid = /^[a-zA-Z0-9]+$/.test(profile.username.value);

      if (!valid) {
        error = true;

        setProfile(prevSetting => ({
          ...prevSetting,
          username: {
            ...prevSetting.username,
            error: true,
            helper: i18n.t('Login.Profile.Helper_Validate_Username_Char'),
          },
        }));
      } else {
        error = false;
        setProfile(prevSetting => ({
          ...prevSetting,
          username: {
            ...prevSetting.username,
            error: false,
            helper: USERNAME_HELPER_TEXT,
          },
        }));
      }
    }

    return !error;
  };

  const validate = (): boolean => {
    const validName = validateName();
    const validUsername = validateUsername();

    return validName && validUsername;
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
            Decentralized metasocial network, pulling content from mainstream social media and
            turning every post into a tipping wallet.
          </Typography>
        </div>
      </div>
      <Typography className={styles.textTitle}>Create New Account</Typography>
      <Typography className={styles.textSetUsername}>
        You can only set your username once, and will be unique each instance
      </Typography>
      <div className={styles.wrapperForm}>
        <div className={styles.box}>
          <TextField
            id="name"
            label={i18n.t('Login.Profile.Placeholder_Display_Name')}
            helperText={profile.name.helper}
            error={profile.name.error}
            fullWidth
            variant="outlined"
            onChange={handleChangeName}
            inputProps={{maxLength: DISPLAY_NAME_MAX_LENGTH}}
          />
          <Typography className={`${styles.count}`} component="span">
            ({profile.name.value.length}/{DISPLAY_NAME_MAX_LENGTH})
          </Typography>
        </div>
        <div className={styles.box}>
          <TextField
            id="username"
            label={i18n.t('Login.Profile.Placeholder_Username')}
            helperText={profile.username.helper}
            error={profile.username.error}
            fullWidth
            variant="outlined"
            onChange={handleChangeUsername}
            inputProps={{maxLength: USERNAME_MAX_LENGTH, style: {textTransform: 'lowercase'}}}
          />
          <Typography className={`${styles.count}`} component="span">
            ({profile.username.value.length}/{USERNAME_MAX_LENGTH})
          </Typography>
        </div>
      </div>
      <div className={styles.wrapperForm}>
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
            disabled={
              !isTermApproved ||
              profile.username.value.length === 0 ||
              profile.name.value.length === 0
            }
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
