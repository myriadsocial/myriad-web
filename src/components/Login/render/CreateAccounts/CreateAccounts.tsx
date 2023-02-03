import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

import getConfig from 'next/config';
import Image from 'next/image';

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';

import {useStyles} from './CreateAccounts.style';

import useConfirm from 'components/common/Confirm/use-confirm.hook';
import ShowIf from 'components/common/show-if.component';
import useMobileDetect from 'src/hooks/use-is-mobile-detect';
import {IcEmail} from 'src/images/Icons';
import {ServerListProps} from 'src/interfaces/server-list';
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
  selectedInstance?: ServerListProps;
};
export default function CreateAccounts(props: ProfileProps) {
  const detect = useMobileDetect();

  const styles = useStyles(detect.isMobile())();
  const {checkUsernameAvailability, email, selectedInstance} = props;
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
    const response = await signUpWithEmail(payload, selectedInstance.apiUrl);
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

  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const instance = selectedInstance?.detail;
  const isDescriptionLong = instance?.description.split(' ').length > 10;

  return (
    <div className={styles.root}>
      <Typography className={styles.textTitle}>Email Used</Typography>
      <div className={styles.wrapperEmail}>
        <IcEmail />
        <Typography className={styles.textEmail}>{email}</Typography>
      </div>
      <div style={{position: 'relative', marginBottom: '15px'}}>
        <Typography variant="h5" className={styles.textTitle}>
          {i18n.t('Login.Profile.Instance')}
        </Typography>
        <div
          id="unselectable-gray-box-instance"
          style={{
            display: 'flex',
            alignItems: 'start',
            paddingLeft: 8,
            paddingTop: 8,
            paddingBottom: isDescriptionLong ? 30 : 8,
            background: '#F5F5F5',
            borderRadius: 4,
            gap: 8,
          }}>
          <Image
            alt={instance?.id}
            src={instance?.serverImageURL ?? ''}
            placeholder="empty"
            height={30}
            width={30}
          />
          <div style={{width: '100%', paddingRight: 8}}>
            <Box
              fontSize={14}
              fontWeight="fontWeightRegular"
              style={{color: 'rgba(115, 66, 204, 1)'}}>
              {instance?.name}
            </Box>
            <Box fontSize={12} fontWeight="fontWeightRegular" style={{color: '#0A0A0A'}}>
              {isDescriptionLong && !expanded
                ? `${instance?.description.split(' ').slice(0, 10).join(' ')}...`
                : instance?.description}
            </Box>
          </div>
        </div>
        <ShowIf condition={isDescriptionLong}>
          <Box
            fontSize={10}
            fontWeight="fontWeightBold"
            style={{
              color: '#6E3FC3',
              position: 'absolute',
              right: 0,
              bottom: 0,
              padding: '10px',
              cursor: 'pointer',
              width: 'max-content',
            }}
            onClick={handleExpand}>
            {!expanded
              ? i18n.t('Login.Options.Prompt_Select_Instance.See_More')
              : i18n.t('Login.Options.Prompt_Select_Instance.See_Less')}
          </Box>
        </ShowIf>
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
