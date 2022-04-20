import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router';

import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  ListItem,
  Typography,
  Tooltip,
} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {useStyles} from './Options.style';

import {
  EthereumNetworkIcon,
  PolkadotNetworkIcon,
  NearNetworkIcon,
  PolygonNetworkDisabledIcon,
  SenderWalletDisabledIcon,
  CoinbaseWalletisabledIcon,
  MetamaskWalletDisabledIcon,
  TrustWalletDisabledIcon,
  KusamaNetworkIcon,
  MyriadCircleIcon,
} from 'src/components/atoms/Icons';
import {PromptComponent as Prompt} from 'src/components/atoms/Prompt/prompt.component';
import {PolkadotLink} from 'src/components/common/PolkadotLink.component';
import ShowIf from 'src/components/common/show-if.component';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {NetworkTypeEnum, WalletTypeEnum} from 'src/lib/api/ext-auth';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type OptionProps = {
  network?: string;
  onConnect?: (accounts: InjectedAccountWithMeta[], network: NetworkTypeEnum) => void;
  onConnectNear?: (nearId: string, callback: () => void, network: NetworkTypeEnum) => void;
};

export const Options: React.FC<OptionProps> = props => {
  const {networks} = useSelector<RootState, UserState>(state => state.userState);
  const styles = useStyles();

  const {onConnect, onConnectNear} = props;

  const navigate = useNavigate();
  const {enablePolkadotExtension, getPolkadotAccounts} = usePolkadotExtension();

  const {connectToNear} = useNearApi();

  const [network, setNetwork] = useState<NetworkTypeEnum | null>(null);
  const [wallet, setWallet] = useState<WalletTypeEnum | null>(null);
  const [termApproved, setTermApproved] = useState(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [extensionChecked, setExtensionChecked] = useState(false);
  const [extensionEnabled, setExtensionEnabled] = useState(false);
  const [connectAttempted, setConnectAttempted] = useState(false);

  const icons = React.useMemo(
    () => ({
      polkadot: <PolkadotNetworkIcon className={styles.icon} />,
      kusama: <KusamaNetworkIcon className={styles.icon} />,
      near: <NearNetworkIcon className={styles.icon} />,
      myriad: <MyriadCircleIcon className={styles.icon} />,
    }),
    [],
  );

  const formatTitle = (id?: string, wallet?: boolean) => {
    if (wallet)
      switch (id) {
        case WalletTypeEnum.POLKADOT:
          return 'Polkadot{.js}';
        case WalletTypeEnum.NEAR:
          return 'NEAR Wallet';
        default:
          return id;
      }

    switch (id) {
      case NetworkTypeEnum.POLKADOT:
        return 'Polkadot';
      case NetworkTypeEnum.NEAR:
        return 'NEAR';
      case NetworkTypeEnum.KUSAMA:
        return 'Kusama';
      case NetworkTypeEnum.MYRIAD:
        return 'Myriad';
      default:
        return id;
    }
  };

  const setSelectedNetwork = (value: NetworkTypeEnum) => () => {
    setNetwork(value);

    switch (value) {
      case NetworkTypeEnum.POLKADOT:
        setSelectedWallet(WalletTypeEnum.POLKADOT)();
        break;
      case NetworkTypeEnum.MYRIAD:
        setSelectedWallet(WalletTypeEnum.POLKADOT)();
        break;
      case NetworkTypeEnum.KUSAMA:
        setSelectedWallet(WalletTypeEnum.POLKADOT)();
        break;
      case NetworkTypeEnum.NEAR:
        setSelectedWallet(WalletTypeEnum.NEAR)();
        break;
      default:
        setWallet(null);
        break;
    }
  };

  const setSelectedWallet = (value: WalletTypeEnum) => () => {
    switch (value) {
      case WalletTypeEnum.POLKADOT:
        setWallet(value);
        checkPolkdostExtensionInstalled();
        break;

      case WalletTypeEnum.NEAR:
        setWallet(value);
        setExtensionChecked(true);
        setExtensionEnabled(true);
        break;

      default:
        break;
    }
  };

  const checkPolkdostExtensionInstalled = async () => {
    const installed = await enablePolkadotExtension();

    setExtensionEnabled(installed);
    setExtensionChecked(true);
  };

  const toggleTermApproved = () => {
    setTermApproved(!termApproved);
  };

  const closeExtensionDisableModal = () => {
    setConnectAttempted(false);
  };

  const handleConnect = async () => {
    const accounts: InjectedAccountWithMeta[] = [];

    switch (wallet) {
      case WalletTypeEnum.POLKADOT:
        // eslint-disable-next-line no-case-declarations
        const polkadotAccounts = await getPolkadotAccounts();

        accounts.push(...polkadotAccounts);

        if (accounts.length > 0) {
          setAccounts(accounts);
          onConnect && onConnect(accounts, network as NetworkTypeEnum);

          navigate('/account');
        } else {
          setWallet(null);
        }

        break;

      case WalletTypeEnum.NEAR: {
        const data = await connectToNear();

        if (data) {
          onConnectNear &&
            onConnectNear(
              data.publicAddress,
              () => {
                navigate('/profile');
              },
              network as NetworkTypeEnum,
            );
        } else {
          console.log('redirection to near auth page');
        }

        break;
      }

      default:
        setWallet(null);
        break;
    }

    setConnectAttempted(true);
  };

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <Typography variant="h5">{i18n.t('Login.Options.Network')}</Typography>
        </div>
        <Grid
          container
          justifyContent="flex-start"
          alignContent="center"
          classes={{root: styles.list}}>
          {networks.map(option => (
            <Grid item xs={3} key={option.id}>
              <ListItem
                disableGutters
                selected={network === option.id}
                onClick={setSelectedNetwork(option.id as NetworkTypeEnum)}>
                <div className={styles.card}>
                  {icons[option.id as keyof typeof icons]}
                  <Typography>{formatTitle(option.id)}</Typography>
                </div>
              </ListItem>
            </Grid>
          ))}
          <Grid item xs={3}>
            <Tooltip title={<Typography component="span">Coming soon</Typography>} arrow>
              <ListItem disableGutters disabled>
                <div className={styles.card}>
                  <EthereumNetworkIcon className={styles.icon} />
                  <Typography>Ethereum</Typography>
                </div>
              </ListItem>
            </Tooltip>
          </Grid>
          <Grid item xs={3}>
            <Tooltip title={<Typography component="span">Coming soon</Typography>} arrow>
              <ListItem disableGutters disabled>
                <div className={styles.card}>
                  <PolygonNetworkDisabledIcon className={styles.icon} />
                  <Typography>Polygon</Typography>
                </div>
              </ListItem>
            </Tooltip>
          </Grid>
        </Grid>
      </div>

      {/* WALLET LIST */}
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <Typography variant="h5">{i18n.t('Login.Options.Wallet')}</Typography>
        </div>
        <Grid
          container
          justifyContent="flex-start"
          alignContent="center"
          classes={{root: styles.list}}>
          <ShowIf
            condition={
              network === null ||
              network === NetworkTypeEnum.POLKADOT ||
              network === NetworkTypeEnum.KUSAMA ||
              network === NetworkTypeEnum.MYRIAD
            }>
            <Grid item xs={3}>
              <ListItem
                component={'button'}
                disableGutters
                disabled={network === null}
                selected={wallet === WalletTypeEnum.POLKADOT}
                onClick={setSelectedWallet(WalletTypeEnum.POLKADOT)}
                className={network !== NetworkTypeEnum.POLKADOT ? styles.walletCardDisabled : ''}>
                <div className={styles.walletCard}>
                  <PolkadotNetworkIcon className={styles.icon} />
                  <Typography>Polkadot.js</Typography>
                </div>
              </ListItem>
            </Grid>
          </ShowIf>
          <ShowIf condition={network === null || network === NetworkTypeEnum.NEAR}>
            <Grid item xs={3}>
              <ListItem
                component={'button'}
                disableGutters
                disabled={network === null || network !== NetworkTypeEnum.NEAR}
                selected={wallet === WalletTypeEnum.NEAR}
                onClick={setSelectedWallet(WalletTypeEnum.NEAR)}
                className={network !== NetworkTypeEnum.NEAR ? styles.walletCardDisabled : ''}>
                <div className={styles.card}>
                  <NearNetworkIcon className={styles.icon} />
                  <Typography>NEAR</Typography>
                </div>
              </ListItem>
            </Grid>
          </ShowIf>
          <ShowIf condition={network === null || network === NetworkTypeEnum.NEAR}>
            <Grid item xs={3}>
              <Tooltip title={<Typography component="span">Coming soon</Typography>} arrow>
                <ListItem
                  disableGutters
                  disabled
                  onClick={setSelectedWallet(WalletTypeEnum.SENDER)}>
                  <div className={styles.walletCard}>
                    <SenderWalletDisabledIcon className={styles.icon} />
                    <Typography style={{fontSize: 13}}>Sender Wallet</Typography>
                  </div>
                </ListItem>
              </Tooltip>
            </Grid>
          </ShowIf>
          <Grid item xs={3}>
            <ListItem
              style={{display: 'none'}}
              disableGutters
              disabled
              onClick={setSelectedWallet(WalletTypeEnum.COINBASE)}>
              <div className={styles.card}>
                <CoinbaseWalletisabledIcon className={styles.icon} />
                <Typography>Coinbase</Typography>
              </div>
            </ListItem>
          </Grid>
          <Grid item xs={3}>
            <ListItem
              style={{display: 'none'}}
              disableGutters
              disabled
              onClick={setSelectedWallet(WalletTypeEnum.METAMASK)}>
              <div className={styles.card}>
                <MetamaskWalletDisabledIcon className={styles.icon} />
                <Typography>Metamask</Typography>
              </div>
            </ListItem>
          </Grid>
          <Grid item xs={3}>
            <ListItem
              style={{display: 'none'}}
              disableGutters
              disabled
              onClick={setSelectedWallet(WalletTypeEnum.TRUST)}>
              <div className={styles.card}>
                <TrustWalletDisabledIcon className={styles.icon} />
                <Typography>Trust Wallet</Typography>
              </div>
            </ListItem>
          </Grid>
        </Grid>
      </div>

      <Grid container direction="column" className={styles.condition}>
        <FormControlLabel
          className={styles.termControl}
          onChange={toggleTermApproved}
          control={<Checkbox name="term" color="primary" className={styles.checkbox} />}
          label={
            <Typography style={{color: '#0A0A0A'}}>
              {i18n.t('Login.Options.Text_Terms_1')}&nbsp;
              <a href="/term-of-use" className={styles.term}>
                {i18n.t('Login.Options.Text_Terms_2')}
              </a>
              &nbsp;{i18n.t('Login.Options.Text_Terms_3')}&nbsp;
              <a href="/privacy-policy" className={styles.term}>
                {i18n.t('Login.Options.Text_Terms_4')}
              </a>
            </Typography>
          }
        />
      </Grid>

      <div>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          disabled={!termApproved || !extensionChecked || wallet === null}
          onClick={handleConnect}>
          {i18n.t('Login.Options.Connect')}
        </Button>
      </div>

      <Prompt
        title={i18n.t('Login.Options.Prompt_Extension.Title')}
        icon="warning"
        open={connectAttempted && extensionChecked && !extensionEnabled}
        onCancel={closeExtensionDisableModal}
        subtitle={
          <Typography>
            {i18n.t('Login.Options.Prompt_Extension.Subtitle_1')}&nbsp;
            <PolkadotLink />
            &nbsp;{i18n.t('Login.Options.Prompt_Extension.Subtitle_2')}
          </Typography>
        }>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={closeExtensionDisableModal}>
          {i18n.t('General.Close')}
        </Button>
      </Prompt>

      <Prompt
        title={i18n.t('Login.Options.Prompt_Account.Title')}
        icon="warning"
        open={
          connectAttempted &&
          extensionChecked &&
          extensionEnabled &&
          accounts.length === 0 &&
          network === NetworkTypeEnum.POLKADOT
        }
        onCancel={closeExtensionDisableModal}
        subtitle={<Typography>{i18n.t('Login.Options.Prompt_Account.Subtitle')}</Typography>}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={closeExtensionDisableModal}>
          {i18n.t('General.Close')}
        </Button>
      </Prompt>
    </div>
  );
};
