import React, {useState} from 'react';
import {useNavigate} from 'react-router';

import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  List,
  ListItem,
  SvgIcon,
  Typography,
} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {useStyles} from './Options.style';

import {PromptComponent as Prompt} from 'src/components/atoms/Prompt/prompt.component';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import EthereumIcon from 'src/images/network/ethereum-disabled.svg';
import NearIcon from 'src/images/network/near.svg';
import PolkadotIcon from 'src/images/network/polkadot.svg';
import PolygonIcon from 'src/images/network/polygon-disabled.svg';
import CoinbaseIcon from 'src/images/wallet/coinbase-disabled.svg';
import MetamaskIcon from 'src/images/wallet/metamask-disabled.svg';
import TrustIcon from 'src/images/wallet/trust-disabled.svg';
import i18n from 'src/locale';

type OptionProps = {
  network?: string;
  onConnect: (accounts: InjectedAccountWithMeta[]) => void;
};

enum NetworkTypeEnum {
  ETHEREUM = 'ethereum',
  POLKADOT = 'polkadot',
  BINANCE = 'binance',
  POLYGON = 'polygon',
  NEAR = 'near',
}

enum WalletTypeEnum {
  POLKADOT = 'polkadot',
  TRUST = 'trust',
  METAMASK = 'metamask',
  COINBASE = 'coinbase',
}

export const Options: React.FC<OptionProps> = props => {
  const styles = useStyles();

  const {onConnect} = props;

  const navigate = useNavigate();
  const {enablePolkadotExtension, getPolkadotAccounts} = usePolkadotExtension();

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
        break;

      default:
        break;
    }

    setConnectAttempted(true);

    if (accounts.length > 0) {
      setAccounts(accounts);
      onConnect(accounts);

      navigate('/account');
    } else {
      setWallet(null);
    }
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
              <SvgIcon component={PolkadotIcon} className={styles.icon} viewBox="0 0 32 32" />
              <Typography>Polkadot</Typography>
            </div>
          </ListItem>
          <ListItem disableGutters disabled onClick={setSelectedNetwork(NetworkTypeEnum.ETHEREUM)}>
            <div className={styles.card}>
              <SvgIcon component={EthereumIcon} className={styles.icon} viewBox="0 0 32 32" />
              <Typography>Ethereum</Typography>
            </div>
          </ListItem>
          <ListItem disableGutters disabled onClick={setSelectedNetwork(NetworkTypeEnum.NEAR)}>
            <div className={styles.card}>
              <SvgIcon component={NearIcon} className={styles.icon} viewBox="0 0 32 32" />
              <Typography>Near</Typography>
            </div>
          </ListItem>
          <ListItem disableGutters disabled onClick={setSelectedNetwork(NetworkTypeEnum.POLYGON)}>
            <div className={styles.card}>
              <SvgIcon component={PolygonIcon} className={styles.icon} viewBox="0 0 32 32" />
              <Typography>Polygon</Typography>
            </div>
          </ListItem>
        </List>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.title}>
          <Typography variant="h5">{i18n.t('Login.Options.Wallet')}</Typography>
        </div>

        <List disablePadding classes={{root: styles.list}}>
          <ListItem
            disableGutters
            disabled={network === null}
            selected={wallet === WalletTypeEnum.POLKADOT}
            onClick={setSelectedWallet(WalletTypeEnum.POLKADOT)}>
            <div className={styles.card}>
              <SvgIcon component={PolkadotIcon} className={styles.icon} viewBox="0 0 32 32" />
              <Typography>Polkadot.js</Typography>
            </div>
          </ListItem>

          <ListItem
            style={{visibility: 'hidden'}}
            disableGutters
            disabled
            onClick={setSelectedWallet(WalletTypeEnum.COINBASE)}>
            <div className={styles.card}>
              <SvgIcon component={CoinbaseIcon} className={styles.icon} viewBox="0 0 32 32" />
              <Typography>Coinbase</Typography>
            </div>
          </ListItem>
          <ListItem
            style={{visibility: 'hidden'}}
            disableGutters
            disabled
            onClick={setSelectedWallet(WalletTypeEnum.METAMASK)}>
            <div className={styles.card}>
              <SvgIcon component={MetamaskIcon} className={styles.icon} viewBox="0 0 32 32" />
              <Typography>Metamask</Typography>
            </div>
          </ListItem>
          <ListItem
            style={{visibility: 'hidden'}}
            disableGutters
            disabled
            onClick={setSelectedWallet(WalletTypeEnum.TRUST)}>
            <div className={styles.card}>
              <SvgIcon component={TrustIcon} className={styles.icon} viewBox="0 0 32 32" />
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
            <Link
              href="https://polkadot.js.org/extension"
              target="_blank"
              className={styles.polkadotLink}>
              Polkadot.js
            </Link>
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
        open={connectAttempted && extensionChecked && extensionEnabled && accounts.length === 0}
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
