import React, {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router';

import {useRouter} from 'next/router';

import {Button, Grid, TextField, Typography} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {useStyles} from './Profile.style';

import {MyriadFullIcon} from 'src/components/atoms/Icons';
import useConfirm from 'src/components/common/Confirm/use-confirm.hook';
import ShowIf from 'src/components/common/show-if.component';
import {useAuthHook} from 'src/hooks/auth.hook';
import {NetworkIdEnum} from 'src/interfaces/network';
import {WalletTypeEnum} from 'src/interfaces/wallet';
import {toHexPublicKey} from 'src/lib/crypto';
import {BlockchainProvider} from 'src/lib/services/blockchain-provider';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';
import {UserState} from 'src/reducers/user/reducer';

type ProfileProps = {
  checkUsernameAvailability: (username: string, callback: (available: boolean) => void) => void;
  walletType: WalletTypeEnum | null;
  networkId: NetworkIdEnum | null;
  account?: InjectedAccountWithMeta | null;
  publicAddress?: string;
  isMobileSignIn?: boolean;
};

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

export const Profile: React.FC<ProfileProps> = props => {
  const {walletType, checkUsernameAvailability, account, publicAddress, networkId, isMobileSignIn} =
    props;
  const {networks} = useSelector<RootState, UserState>(state => state.userState);
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);

  const styles = useStyles();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const router = useRouter();

  const {signUpWithExternalAuth} = useAuthHook();

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

  React.useEffect(() => {
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

  const handleChangeWallet = async () => {
    if (walletType === WalletTypeEnum.NEAR) {
      const network = networks.find(network => network.id === NetworkIdEnum.NEAR);

      if (network) {
        const blockchain = await BlockchainProvider.connect(network);
        const provider = blockchain.Near;
        const {wallet} = provider.provider;

        if (wallet.isSignedIn()) {
          wallet.signOut();
          router.replace(router.route, undefined, {shallow: true});
        } else {
          console.log('no signed in NEAR wallet found!');
        }
      }
    }
    navigate('/wallet');
  };

  const validate = (): boolean => {
    const validName = validateName();
    const validUsername = validateUsername();

    return validName && validUsername;
  };

  const handleConfirmation = useCallback(() => {
    const valid = validate();

    if (valid && (account || publicAddress)) {
      checkUsernameAvailability(profile.username.value, available => {
        if (available) {
          confirmRegisterProfile();
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
  }, [account, profile]);

  const handleSubmit = async () => {
    let substrateAccount: InjectedAccountWithMeta | undefined;
    let address = publicAddress;

    if (walletType === WalletTypeEnum.POLKADOT) {
      if (!account) return;
      address = toHexPublicKey(account);
      substrateAccount = account;
    }

    if (!address) return;
    const registered = await signUpWithExternalAuth(
      address,
      profile.name.value,
      profile.username.value,
      networkId,
      substrateAccount,
    );

    if (!registered) {
      navigate('/wallet');
    }
  };

  const confirmRegisterProfile = useCallback(() => {
    confirm({
      title: i18n.t('Login.Profile.Prompt.Title'),
      description: i18n.t('Login.Profile.Prompt.Subtitle'),
      confirmationText: i18n.t('Login.Profile.Prompt.Btn_Yes'),
      cancellationText: i18n.t('Login.Profile.Prompt.Btn_No'),
      onConfirm: handleSubmit,
    });
  }, [handleSubmit]);

  return (
    <>
      <ShowIf condition={!isMobileSignIn}>
        <div className={styles.root}>
          <div style={{marginBottom: 33}}>
            <Typography variant="h5" style={{fontWeight: 600}}>
              {i18n.t('Login.Profile.Title')}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {i18n.t('Login.Profile.Subtitle')}
            </Typography>
          </div>
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

          <Grid container className={styles.action} justifyContent="space-between">
            <Button onClick={handleChangeWallet} variant="outlined" color="secondary" size="small">
              {i18n.t('Login.Profile.Btn_Change_Wallet')}
            </Button>

            <Button
              disabled={profile.username.value.length === 0}
              onClick={handleConfirmation}
              variant="contained"
              color="primary"
              size="small">
              {i18n.t('Login.Profile.Btn_Register')}
            </Button>
          </Grid>
        </div>
      </ShowIf>
      <ShowIf condition={isMobileSignIn}>
        <div className={styles.mobileRoot}>
          <div className={styles.logoWrapper}>
            <div className={styles.logo}>
              <MyriadFullIcon />
            </div>

            <Typography variant="h5" component="h1" className={styles.title}>
              {i18n.t('Login.Layout.Title_left')}{' '}
              <span className={styles.titlePrimary}>{i18n.t('Login.Layout.Title_right')}</span>
            </Typography>
          </div>
          <div className={styles.mobileCard}>
            <div style={{marginBottom: 24}}>
              <div className={styles.title}>
                <Typography variant="h5" style={{fontWeight: 600}}>
                  {i18n.t('Login.Profile.Title')}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {i18n.t('Login.Profile.Subtitle')}
                </Typography>
              </div>
            </div>

            {/* CREATE USER FORM */}
            <div className={styles.box}>
              <TextField
                id="name"
                label={i18n.t('Login.Profile.Placeholder_Display_Name')}
                helperText={profile.name.helper}
                FormHelperTextProps={{style: {marginLeft: 0}}}
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
                FormHelperTextProps={{style: {marginLeft: 0}}}
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
            <div className={styles.actionWrapper}>
              <Button
                onClick={handleChangeWallet}
                variant="outlined"
                color="secondary"
                size="small">
                {i18n.t('Login.Profile.Btn_Change_Wallet')}
              </Button>

              <Button
                disabled={profile.username.value.length === 0}
                onClick={handleConfirmation}
                variant="contained"
                color="primary"
                size="small">
                {i18n.t('Login.Profile.Btn_Register')}
              </Button>
            </div>
          </div>
        </div>
      </ShowIf>
    </>
  );
};
