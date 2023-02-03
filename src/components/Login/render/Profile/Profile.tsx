import React, {useEffect, useCallback, useState, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router';

import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';

import {
  Button,
  Box,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {useStyles} from './Profile.style';

import {
  PolkadotNetworkIcon,
  NearNetworkIcon,
  SenderWalletDisabledIcon,
  MyNearWalletIcon,
} from 'src/components/atoms/Icons';
import useConfirm from 'src/components/common/Confirm/use-confirm.hook';
import ShowIf from 'src/components/common/show-if.component';
import {useAuthHook} from 'src/hooks/auth.hook';
import {NetworkIdEnum} from 'src/interfaces/network';
import {ServerListProps} from 'src/interfaces/server-list';
import {WalletTypeEnum} from 'src/interfaces/wallet';
import {toHexPublicKey} from 'src/lib/crypto';
import {BlockchainProvider} from 'src/lib/services/blockchain-provider';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';
import {UserState} from 'src/reducers/user/reducer';

type ProfileProps = {
  checkUsernameAvailability: (username: string, callback: (available: boolean) => void) => void;
  walletType: WalletTypeEnum | string | null;
  networkId: NetworkIdEnum | null;
  account?: InjectedAccountWithMeta | null;
  publicAddress?: string;
  isMobileSignIn?: boolean;
  selectedInstance?: ServerListProps;
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
  const {
    walletType,
    checkUsernameAvailability,
    account,
    publicAddress,
    networkId,
    isMobileSignIn,
    selectedInstance,
  } = props;
  const {networks} = useSelector<RootState, UserState>(state => state.userState);
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const [termApproved, setTermApproved] = useState(false);
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

  const walletIcons = useMemo(
    () => ({
      'polkadot{.js}': <PolkadotNetworkIcon />,
      sender: <SenderWalletDisabledIcon />,
      near: <NearNetworkIcon />,
      'my-near': <MyNearWalletIcon />,
    }),
    [],
  );

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
    navigate('/options');
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
      walletType as WalletTypeEnum,
    );

    if (!registered) {
      navigate('/');
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

  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleTermApproved = () => {
    setTermApproved(!termApproved);
  };

  const instance = selectedInstance?.detail;
  const isDescriptionLong = instance.description.split(' ').length > 10;

  return (
    <>
      <ShowIf condition={!isMobileSignIn}>
        <div className={styles.root}>
          <div style={{marginBottom: 24, gap: 16, display: 'flex', flexDirection: 'column'}}>
            <div>
              <Typography variant="h5" style={{fontWeight: 600}}>
                {i18n.t('Login.Profile.Wallet')}
              </Typography>
              <div
                id="unselectable-gray-box-wallet"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 8,
                  paddingTop: 8,
                  paddingBottom: 8,
                  background: '#F5F5F5',
                  borderRadius: 4,
                  gap: 8,
                }}>
                {walletIcons[walletType]}
                <div>
                  <Box
                    fontSize={14}
                    fontWeight="fontWeightRegular"
                    style={{color: 'rgba(115, 66, 204, 1)'}}>
                    {account?.meta?.name || ''}
                  </Box>
                  <Box fontSize={12} fontWeight="fontWeightRegular" style={{color: '#0A0A0A'}}>
                    {account?.address || publicAddress?.split('/')[1] || 'Unknown Account'}
                  </Box>
                </div>
              </div>
            </div>
            <div style={{position: 'relative'}}>
              <Typography variant="h5" style={{fontWeight: 600}}>
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
                  alt={instance.id}
                  src={instance.serverImageURL ?? ''}
                  placeholder="empty"
                  height={30}
                  width={30}
                />
                <div style={{width: '100%', paddingRight: 8}}>
                  <Box
                    fontSize={14}
                    fontWeight="fontWeightRegular"
                    style={{color: 'rgba(115, 66, 204, 1)'}}>
                    {instance.name}
                  </Box>
                  <Box fontSize={12} fontWeight="fontWeightRegular" style={{color: '#0A0A0A'}}>
                    {isDescriptionLong && !expanded
                      ? `${instance.description.split(' ').slice(0, 10).join(' ')}...`
                      : instance.description}
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
          </div>
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

          <div className={styles.action}>
            <Button
              onClick={handleChangeWallet}
              variant="outlined"
              color="secondary"
              size="small"
              fullWidth>
              {i18n.t('Login.Profile.Btn_Change_Wallet')}
            </Button>
            <div style={{width: 8}} />
            <Button
              disabled={profile.username.value.length === 0 || !termApproved}
              onClick={handleConfirmation}
              variant="contained"
              color="primary"
              fullWidth
              size="small">
              {i18n.t('Login.Profile.Btn_Register')}
            </Button>
          </div>
        </div>
      </ShowIf>
      <ShowIf condition={isMobileSignIn}>
        <div className={styles.mobileRoot}>
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
            <div className={styles.actionWrapper}>
              <Button
                onClick={handleChangeWallet}
                variant="outlined"
                color="secondary"
                size="small">
                {i18n.t('Login.Profile.Btn_Change_Wallet')}
              </Button>

              <Button
                disabled={!profile.username.value || !termApproved}
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
