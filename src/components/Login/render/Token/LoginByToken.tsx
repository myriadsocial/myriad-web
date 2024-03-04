import { useState, useEffect, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { signIn } from 'next-auth/react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

import {
  Button,
  TextField,
  Typography,
  Grid,
  ListItem,
  Tooltip,
} from '@material-ui/core';

import { useStyles } from './LoginByToken.style';

import { COOKIE_INSTANCE_URL } from 'components/SelectServer';
import SelectServer from 'src/components/SelectServer';
import {
  EthereumNetworkIcon,
  KusamaNetworkIcon,
  DebioNetworkIcon,
  MyriadOctopusIcon,
  MyriadRococoIcon,
  NearNetworkIcon,
  PolkadotNetworkIcon,
  PolygonNetworkDisabledIcon,
} from 'src/components/atoms/Icons';
import { formatNetworkTitle } from 'src/helpers/wallet';
import { useAlertHook } from 'src/hooks/use-alert.hook';
import { NetworkIdEnum } from 'src/interfaces/network';
import { ServerListProps } from 'src/interfaces/server-list';
import { BlockchainPlatform } from 'src/interfaces/wallet';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';
import { UserState } from 'src/reducers/user/reducer';

type LoginByTokenProps = {
  onNext: (
    successCallback: () => void,
    failedCallback: () => void,
    token: string,
  ) => Promise<void>;
};

const LoginByToken = ({ onNext }: LoginByTokenProps) => {
  const styles = useStyles();
  const router = useRouter();
  const getMobileIconStyles = styles.icon;
  const { networks } = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const [cookies] = useCookies([COOKIE_INSTANCE_URL]);
  const { publicRuntimeConfig } = getConfig();
  const { showAlert } = useAlertHook();

  const [token, setToken] = useState('');
  const [networkId, setNetworkId] = useState<NetworkIdEnum | null>(null);
  const [rpcUrl, setRpcUrl] = useState<string | null>(null);
  const [error, setError] = useState({
    isError: false,
    message: '',
  });
  const icons = useMemo(
    () => ({
      polkadot: <PolkadotNetworkIcon className={getMobileIconStyles} />,
      kusama: <KusamaNetworkIcon className={getMobileIconStyles} />,
      near: <NearNetworkIcon className={getMobileIconStyles} />,
      myriad: <MyriadOctopusIcon className={getMobileIconStyles} />,
      rococo: <MyriadRococoIcon className={getMobileIconStyles} />,
      debio: <DebioNetworkIcon className={getMobileIconStyles} />,
    }),
    [],
  );
  const [, setBlockchainPlatform] = useState<BlockchainPlatform | null>(null);

  useEffect(() => {
    const token = router?.query?.token?.toString() ?? '';
    tokenValidation(token);
  }, [router.query.token]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    tokenValidation(input);
  };

  const tokenValidation = (token: string) => {
    if (!token.length) {
      setError({ isError: false, message: '' });
    } else {
      setError({
        isError: false,
        message: '',
      });
    }
    setToken(token);
  };

  const navigate = useNavigate();

  const handleNext = () => {
    onNext(
      () => {
        signIn('tokenCredentials', {
          token,
          rpcUrl,
          instanceURL: cookies[COOKIE_INSTANCE_URL],
          redirect: false,
          callbackUrl: publicRuntimeConfig.appAuthURL,
        }).then(response => {
          if (response.ok) {
            router.reload();
            router.push('/');
          }

          if (response.error) {
            showAlert({
              message: token
                ? i18n.t('Login.Alert.Invalid_OTP')
                : i18n.t('Login.Alert.Message'),
              severity: 'error',
              title: i18n.t('Login.Alert.Title'),
            });
          }
        });
      },
      () => {
        navigate('/login');
      },
      token,
    );
  };

  const handleBack = () => {
    navigate('/');
  };

  const setSelectedNetwork =
    (
      networkId: NetworkIdEnum,
      blockchainPlatform: BlockchainPlatform,
      rpcUrl: string,
    ) =>
    () => {
      setNetworkId(networkId);
      setBlockchainPlatform(blockchainPlatform);
      setRpcUrl(rpcUrl);
    };

  const handleSwitchInstance = (
    server: ServerListProps,
    callback?: () => void,
  ) => {
    callback && callback();
  };

  return (
    <div className={styles.root}>
      <div>
        <Typography className={styles.title}>
          {i18n.t('Login.Token.LoginByToken.Title')}
        </Typography>
        <Typography className={styles.subtitle}>
          {i18n.t('Login.Token.LoginByToken.Subtitle')}
        </Typography>
      </div>
      <Grid
        container
        justifyContent="flex-start"
        alignContent="center"
        classes={{ root: styles.list }}>
        {networks.map(network => (
          <Grid item xs={3} key={network.id}>
            <ListItem
              disableGutters
              selected={networkId === network.id}
              onClick={setSelectedNetwork(
                network.id,
                network.blockchainPlatform,
                network.rpcURL,
              )}>
              <div className={styles.card}>
                {icons[network.id as keyof typeof icons]}
                <Typography>{formatNetworkTitle(network)}</Typography>
              </div>
            </ListItem>
          </Grid>
        ))}
        <Grid item xs={3}>
          <Tooltip
            title={
              <Typography component="span">
                {i18n.t('Login.Options.Tooltip_Wallet')}
              </Typography>
            }
            arrow>
            <ListItem disableGutters disabled>
              <div className={styles.card}>
                <EthereumNetworkIcon className={styles.icon} />
                <Typography>Ethereum</Typography>
              </div>
            </ListItem>
          </Tooltip>
        </Grid>
        <Grid item xs={3}>
          <Tooltip
            title={
              <Typography component="span">
                {i18n.t('Login.Options.Tooltip_Wallet')}
              </Typography>
            }
            arrow>
            <ListItem disableGutters disabled>
              <div className={styles.card}>
                <PolygonNetworkDisabledIcon className={styles.icon} />
                <Typography>Polygon</Typography>
              </div>
            </ListItem>
          </Tooltip>
        </Grid>
      </Grid>
      <TextField
        fullWidth
        id="user-email-input"
        label="Email"
        variant="outlined"
        placeholder={i18n.t('Login.Token.LoginByToken.Email_Placeholder')}
        value={token}
        onChange={handleChange}
        error={error.isError}
        helperText={error.isError ? error.message : ''}
      />
      <SelectServer page="login" onSwitchInstance={handleSwitchInstance} />
      <div className={styles.actionWrapper}>
        <Button variant="outlined" color="primary" onClick={handleBack}>
          {i18n.t('Login.Token.LoginByToken.Back')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!token.length || error.isError}
          onClick={handleNext}>
          {i18n.t('Login.Token.LoginByToken.Next')}
        </Button>
      </div>
    </div>
  );
};

export default LoginByToken;
