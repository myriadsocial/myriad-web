import React, {useState} from 'react';
import {useNavigate} from 'react-router';

import Link from 'next/link';

import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  List,
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
  PolkadotWalletIcon,
  SenderWalletDisabledIcon,
  CoinbaseWalletisabledIcon,
  MetamaskWalletDisabledIcon,
  TrustWalletDisabledIcon,
} from 'src/components/atoms/Icons';
import {PromptComponent as Prompt} from 'src/components/atoms/Prompt/prompt.component';
import {PolkadotLink} from 'src/components/common/PolkadotLink.component';
import ShowIf from 'src/components/common/show-if.component';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {WalletTypeEnum} from 'src/lib/api/ext-auth';
import i18n from 'src/locale';

type OptionProps = {
  network?: string;
  onConnect?: (accounts: InjectedAccountWithMeta[]) => void;
  onConnectNear?: (nearId: string, callback: () => void) => void;
};

enum NetworkTypeEnum {
  ETHEREUM = 'ethereum',
  POLKADOT = 'polkadot',
  BINANCE = 'binance',
  POLYGON = 'polygon',
  NEAR = 'near',
}

export const Options: React.FC<OptionProps> = props => {
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

  const setSelectedNetwork = (value: NetworkTypeEnum) => () => {
    setNetwork(value);

    if (value === NetworkTypeEnum.POLKADOT) {
      setSelectedWallet(WalletTypeEnum.POLKADOT)();
    } else if (value === NetworkTypeEnum.NEAR) {
      setSelectedWallet(WalletTypeEnum.NEAR)();
    } else {
      setWallet(null);
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
          onConnect && onConnect(accounts);

          navigate('/account');
        } else {
          setWallet(null);
        }

        break;

      case WalletTypeEnum.NEAR: {
        const data = await connectToNear();

        if (data) {
          onConnectNear &&
            onConnectNear(data.publicAddress, () => {
              navigate('/profile');
            });
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
        <List disablePadding classes={{root: styles.list}}>
          <ListItem
            disableGutters
            selected={network === NetworkTypeEnum.POLKADOT}
            onClick={setSelectedNetwork(NetworkTypeEnum.POLKADOT)}>
            <div className={styles.card}>
              <PolkadotNetworkIcon className={styles.icon} />
              <Typography>Polkadot</Typography>
            </div>
          </ListItem>
          <ListItem
            disableGutters
            selected={network === NetworkTypeEnum.NEAR}
            onClick={setSelectedNetwork(NetworkTypeEnum.NEAR)}>
            <div className={styles.card}>
              <NearNetworkIcon className={styles.icon} />
              <Typography>NEAR</Typography>
            </div>
          </ListItem>
          <Tooltip title={<Typography component="span">Coming soon</Typography>} arrow>
            <ListItem
              disableGutters
              disabled
              onClick={setSelectedNetwork(NetworkTypeEnum.ETHEREUM)}>
              <div className={styles.card}>
                <EthereumNetworkIcon className={styles.icon} />
                <Typography>Ethereum</Typography>
              </div>
            </ListItem>
          </Tooltip>
          <Tooltip title={<Typography component="span">Coming soon</Typography>} arrow>
            <ListItem disableGutters disabled onClick={setSelectedNetwork(NetworkTypeEnum.POLYGON)}>
              <div className={styles.card}>
                <PolygonNetworkDisabledIcon className={styles.icon} />
                <Typography>Polygon</Typography>
              </div>
            </ListItem>
          </Tooltip>
        </List>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.title}>
          <Typography variant="h5">{i18n.t('Login.Options.Wallet')}</Typography>
        </div>

        <List disablePadding classes={{root: styles.list}}>
          <ShowIf condition={network === null || network === NetworkTypeEnum.POLKADOT}>
            <ListItem
              component={'button'}
              disableGutters
              disabled={network === null || network !== NetworkTypeEnum.POLKADOT}
              selected={wallet === WalletTypeEnum.POLKADOT}
              onClick={setSelectedWallet(WalletTypeEnum.POLKADOT)}
              className={network !== NetworkTypeEnum.POLKADOT ? styles.walletCardDisabled : ''}>
              <div className={styles.walletCard}>
                <PolkadotWalletIcon className={styles.icon} />
                <Typography>Polkadot.js</Typography>
              </div>
            </ListItem>
          </ShowIf>

          <ShowIf condition={network === null || network === NetworkTypeEnum.NEAR}>
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
          </ShowIf>

          <ShowIf condition={network === null || network === NetworkTypeEnum.NEAR}>
            <Tooltip title={<Typography component="span">Coming soon</Typography>} arrow>
              <ListItem disableGutters disabled onClick={setSelectedWallet(WalletTypeEnum.SENDER)}>
                <div className={styles.walletCard}>
                  <SenderWalletDisabledIcon className={styles.icon} />
                  <Typography style={{display: 'inline-block'}}>Sender Wallet</Typography>
                </div>
              </ListItem>
            </Tooltip>
          </ShowIf>

          <ListItem
            style={{visibility: 'hidden'}}
            disableGutters
            disabled
            onClick={setSelectedWallet(WalletTypeEnum.COINBASE)}>
            <div className={styles.card}>
              <CoinbaseWalletisabledIcon className={styles.icon} />
              <Typography>Coinbase</Typography>
            </div>
          </ListItem>
          <ListItem
            style={{visibility: 'hidden'}}
            disableGutters
            disabled
            onClick={setSelectedWallet(WalletTypeEnum.METAMASK)}>
            <div className={styles.card}>
              <MetamaskWalletDisabledIcon className={styles.icon} />
              <Typography>Metamask</Typography>
            </div>
          </ListItem>
          <ListItem
            style={{visibility: 'hidden'}}
            disableGutters
            disabled
            onClick={setSelectedWallet(WalletTypeEnum.TRUST)}>
            <div className={styles.card}>
              <TrustWalletDisabledIcon className={styles.icon} />
              <Typography>Trust Wallet</Typography>
            </div>
          </ListItem>
        </List>
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
