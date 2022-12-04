import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router';

import {Button, Grid, ListItem, Tooltip, Typography} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {useStyles} from './Options.style';

import SelectServer from 'src/components/SelectServer';
import {
  CoinbaseWalletisabledIcon,
  EthereumNetworkIcon,
  KusamaNetworkIcon,
  DebioNetworkIcon,
  MetamaskWalletDisabledIcon,
  MyNearWalletIcon,
  MyriadCircleIcon,
  NearNetworkIcon,
  PolkadotNetworkIcon,
  PolygonNetworkDisabledIcon,
  SenderWalletDisabledIcon,
  TrustWalletDisabledIcon,
  NovaDisableIcon,
} from 'src/components/atoms/Icons';
import {PromptComponent as Prompt} from 'src/components/atoms/Prompt/prompt.component';
import {PolkadotLink} from 'src/components/common/PolkadotLink.component';
import ShowIf from 'src/components/common/show-if.component';
import {formatNetworkTitle} from 'src/helpers/wallet';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import {ServerListProps} from 'src/interfaces/server-list';
import {WalletWithSigner} from 'src/interfaces/user';
import {BlockchainPlatform, WalletTypeEnum} from 'src/interfaces/wallet';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type OptionProps = {
  network?: string;
  onConnect?: (accounts: InjectedAccountWithMeta[], network: Network) => void;
  onConnectNear?: (callback: () => void, network: Network, wallet: WalletWithSigner) => void;
  isMobileSignIn?: boolean;
};

export const Options: React.FC<OptionProps> = props => {
  const {onConnect, onConnectNear, isMobileSignIn} = props;
  const {networks} = useSelector<RootState, UserState>(state => state.userState);

  const styles = useStyles();
  const navigate = useNavigate();

  const {query} = useQueryParams();
  const {network} = query;
  const {enablePolkadotExtension, getPolkadotAccounts} = usePolkadotExtension();
  const {connectToNear} = useNearApi();

  const [currentNetwork, setCurrentNetwork] = useState<Network | null>(null);
  const [walletType, setWalletType] = useState<WalletTypeEnum | null>(null);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [extensionChecked, setExtensionChecked] = useState(false);
  const [extensionEnabled, setExtensionEnabled] = useState(false);
  const [connectAttempted, setConnectAttempted] = useState(false);
  const [hideOptions, setHideOptions] = useState(false);

  const networksOnMobile = networks.filter(
    network => network.id === NetworkIdEnum.POLKADOT || network.id === NetworkIdEnum.NEAR,
  );

  const getMobileIconStyles = isMobileSignIn ? styles.rowCardIcon : styles.icon;

  const networkIcons = useMemo(
    () => ({
      polkadot: <PolkadotNetworkIcon className={getMobileIconStyles} />,
      kusama: <KusamaNetworkIcon className={getMobileIconStyles} />,
      near: <NearNetworkIcon className={getMobileIconStyles} />,
      myriad: <MyriadCircleIcon className={getMobileIconStyles} />,
      debio: <DebioNetworkIcon className={getMobileIconStyles} />,
    }),
    [],
  );

  const walletIcons = useMemo(
    () => ({
      polkadot: <PolkadotNetworkIcon className={getMobileIconStyles} />,
      sender: <SenderWalletDisabledIcon className={getMobileIconStyles} />,
      near: <NearNetworkIcon className={getMobileIconStyles} />,
      nova: <NovaDisableIcon className={getMobileIconStyles} />,
      'my-near': <MyNearWalletIcon className={getMobileIconStyles} />,
    }),
    [],
  );

  const setSelectedNetwork = (network: Network) => () => {
    setCurrentNetwork(network);

    switch (network.blockchainPlatform) {
      case BlockchainPlatform.SUBSTRATE:
        return setSelectedWallet(WalletTypeEnum.POLKADOT)();
      case BlockchainPlatform.NEAR:
        return setSelectedWallet(WalletTypeEnum.NEAR)();
      default:
        return setWalletType(null);
    }
  };

  const setSelectedWallet = (value: WalletTypeEnum) => () => {
    switch (value) {
      case WalletTypeEnum.POLKADOT:
        setWalletType(value);
        checkPolkdostExtensionInstalled();
        break;

      case WalletTypeEnum.MYNEAR:
      case WalletTypeEnum.NEAR:
        setWalletType(value);
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
    return installed;
  };

  const closeExtensionDisableModal = () => {
    setConnectAttempted(false);
  };

  const handleConnect = useCallback(async () => {
    const accounts: InjectedAccountWithMeta[] = [];

    switch (walletType) {
      case WalletTypeEnum.POLKADOT:
        const polkadotAccounts = await getPolkadotAccounts();

        accounts.push(...polkadotAccounts);

        if (accounts.length > 0) {
          setAccounts(accounts);
          onConnect && onConnect(accounts, currentNetwork);

          navigate('/account');
        } else {
          setWalletType(null);
          if (network) {
            setHideOptions(true);
          }
        }

        break;

      case WalletTypeEnum.MYNEAR:
      case WalletTypeEnum.NEAR: {
        const data = await connectToNear(undefined, undefined, walletType, 'login option');

        if (data) {
          const wallet = {
            id: data.publicAddress,
            blockchainPlatform: BlockchainPlatform.NEAR,
            type: walletType,
          };
          onConnectNear &&
            onConnectNear(
              () => {
                navigate('/profile');
              },
              currentNetwork,
              wallet as WalletWithSigner,
            );
        } else {
          // redirection to near auth page
        }

        break;
      }

      default:
        setWalletType(null);
        break;
    }

    setConnectAttempted(true);
  }, [walletType, currentNetwork]);

  useEffect(() => {
    const doSelectAccount = async () => {
      if (!network) return setHideOptions(true);
      const networkExists = networks.find(e => e.id === network.toString());
      if (!networkExists) return setHideOptions(true);
      if (network === NetworkIdEnum.NEAR) {
        return setHideOptions(true);
      }

      const installed = await checkPolkdostExtensionInstalled();
      if (!installed) return setHideOptions(true);

      setSelectedNetwork(networkExists)();
      setSelectedWallet(WalletTypeEnum.POLKADOT)();
      return setTimeout(() => {
        handleConnect();
      }, 100);
    };
    doSelectAccount();
  }, [handleConnect]);

  const handleSwitchInstance = (server: ServerListProps, callback?: () => void) => {
    setWalletType(null);
    setCurrentNetwork(null);

    callback && callback();
  };

  return (
    <ShowIf condition={hideOptions}>
      <ShowIf condition={!isMobileSignIn}>
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
              {networks.map(network => (
                <Grid item xs={3} key={network.id}>
                  <ListItem
                    disableGutters
                    selected={currentNetwork?.id === network.id}
                    onClick={setSelectedNetwork(network)}>
                    <div className={styles.card}>
                      {networkIcons[network.id as keyof typeof networkIcons]}
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
          </div>
          {/* WALLET LIST */}
          <div className={styles.wrapper}>
            <ShowIf condition={Boolean(walletType)}>
              <div className={styles.title}>
                <Typography variant="h5">{i18n.t('Login.Options.Wallet')}</Typography>
              </div>
            </ShowIf>
            <Grid
              container
              justifyContent="flex-start"
              alignContent="center"
              classes={{root: styles.list}}>
              <ShowIf
                condition={currentNetwork?.blockchainPlatform === BlockchainPlatform.SUBSTRATE}>
                <Grid item xs={3}>
                  <ListItem
                    component={'button'}
                    disableGutters
                    disabled={currentNetwork?.id === null}
                    selected={walletType === WalletTypeEnum.POLKADOT}
                    onClick={setSelectedWallet(WalletTypeEnum.POLKADOT)}
                    className={
                      currentNetwork?.id !== NetworkIdEnum.POLKADOT ? styles.walletCardDisabled : ''
                    }>
                    <div className={styles.walletCard}>
                      <PolkadotNetworkIcon className={styles.icon} />
                      <Typography>Polkadot.js</Typography>
                    </div>
                  </ListItem>
                </Grid>
                <Grid item xs={3}>
                  <Tooltip
                    title={
                      <Typography component="span">
                        {i18n.t('Login.Options.Tooltip_Wallet')}
                      </Typography>
                    }
                    arrow>
                    <ListItem
                      disableGutters
                      disabled
                      onClick={setSelectedWallet(WalletTypeEnum.SENDER)}>
                      <div className={styles.walletCard}>
                        {walletIcons['nova']}
                        <Typography style={{fontSize: 13}}>Nova Wallet</Typography>
                      </div>
                    </ListItem>
                  </Tooltip>
                </Grid>
              </ShowIf>
              <ShowIf condition={currentNetwork?.blockchainPlatform === BlockchainPlatform.NEAR}>
                {[WalletTypeEnum.NEAR, WalletTypeEnum.MYNEAR].map(e => {
                  return (
                    <Grid item xs={3} key={e}>
                      <ListItem
                        disableGutters
                        disabled={
                          currentNetwork?.id === null || currentNetwork?.id !== NetworkIdEnum.NEAR
                        }
                        selected={e === walletType}
                        onClick={setSelectedWallet(e)}
                        className={
                          currentNetwork?.id !== NetworkIdEnum.NEAR ? styles.walletCardDisabled : ''
                        }>
                        <div className={styles.card}>
                          {e === WalletTypeEnum.NEAR ? (
                            <NearNetworkIcon className={styles.icon} />
                          ) : (
                            <MyNearWalletIcon className={styles.icon} />
                          )}
                          <Typography>
                            {e === WalletTypeEnum.NEAR ? 'NEAR Wallet' : 'MyNearWallet'}
                          </Typography>
                        </div>
                      </ListItem>
                    </Grid>
                  );
                })}
              </ShowIf>
              <ShowIf condition={currentNetwork?.blockchainPlatform === BlockchainPlatform.NEAR}>
                <Grid item xs={3}>
                  <Tooltip
                    title={
                      <Typography component="span">
                        {i18n.t('Login.Options.Tooltip_Wallet')}
                      </Typography>
                    }
                    arrow>
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

          <SelectServer page="login" onSwitchInstance={handleSwitchInstance} />
          <div className={styles.actionWrapper}>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/')}>
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!extensionChecked || walletType === null}
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
              currentNetwork?.id === NetworkIdEnum.POLKADOT
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
      </ShowIf>
      <ShowIf condition={isMobileSignIn}>
        <div className={styles.mobileRoot}>
          <div className={styles.mobileCard}>
            <div style={{marginBottom: 24}}>
              <div className={styles.title}>
                <Typography variant="h5">{i18n.t('Login.Options.Network')}</Typography>
              </div>
              <Grid
                container
                justifyContent="flex-start"
                direction="column"
                classes={{root: styles.list}}>
                {networksOnMobile.map(network => (
                  <Grid item xs={12} key={network.id}>
                    {network.id === NetworkIdEnum.POLKADOT ? (
                      <>
                        <ListItem disableGutters disabled>
                          <div className={styles.rowCard}>
                            {networkIcons['polkadot']}
                            <Typography>{formatNetworkTitle(network)}</Typography>
                          </div>
                        </ListItem>
                        <Typography color="primary">* {i18n.t('Mobile.Polkadot_Alert')}</Typography>
                      </>
                    ) : (
                      <ListItem
                        disableGutters
                        selected={currentNetwork?.id === network.id}
                        onClick={setSelectedNetwork(network)}>
                        <div className={styles.rowCard}>
                          {networkIcons[network.id as keyof typeof networkIcons]}
                          <Typography>{formatNetworkTitle(network)}</Typography>
                        </div>
                      </ListItem>
                    )}
                  </Grid>
                ))}
              </Grid>
            </div>

            {/* WALLET LIST */}
            <div>
              <ShowIf condition={Boolean(walletType)}>
                <div className={styles.title}>
                  <Typography variant="h5">{i18n.t('Login.Options.Wallet')}</Typography>
                </div>
              </ShowIf>
              <Grid
                container
                justifyContent="flex-start"
                direction="column"
                classes={{root: styles.list}}>
                <ShowIf condition={currentNetwork?.blockchainPlatform === BlockchainPlatform.NEAR}>
                  {[WalletTypeEnum.NEAR, WalletTypeEnum.MYNEAR].map(e => {
                    return (
                      <Grid item xs={12} key={e}>
                        <ListItem
                          disableGutters
                          disabled={
                            currentNetwork?.id === null || currentNetwork?.id !== NetworkIdEnum.NEAR
                          }
                          selected={e === walletType}
                          onClick={setSelectedWallet(e)}
                          className={
                            currentNetwork?.id !== NetworkIdEnum.NEAR
                              ? styles.walletCardDisabled
                              : ''
                          }>
                          <div className={styles.rowCard}>
                            {walletIcons[e]}
                            <Typography>
                              {e === WalletTypeEnum.NEAR ? 'NEAR Wallet' : 'MyNearWallet'}
                            </Typography>
                          </div>
                        </ListItem>
                      </Grid>
                    );
                  })}
                </ShowIf>
                <ShowIf condition={currentNetwork?.blockchainPlatform === BlockchainPlatform.NEAR}>
                  <Grid item xs={12}>
                    <Tooltip
                      title={
                        <Typography component="span">
                          {i18n.t('Login.Options.Tooltip_Wallet')}
                        </Typography>
                      }
                      arrow>
                      <ListItem
                        disableGutters
                        disabled
                        onClick={setSelectedWallet(WalletTypeEnum.SENDER)}>
                        <div className={styles.rowCard}>
                          {walletIcons['sender']}
                          <Typography style={{fontSize: 13}}>Sender Wallet</Typography>
                        </div>
                      </ListItem>
                    </Tooltip>
                  </Grid>
                </ShowIf>
                <ShowIf
                  condition={currentNetwork?.blockchainPlatform === BlockchainPlatform.SUBSTRATE}>
                  <Grid item xs={12}>
                    <ListItem
                      component={'button'}
                      disableGutters
                      disabled={currentNetwork?.id === null}
                      selected={walletType === WalletTypeEnum.POLKADOT}
                      onClick={setSelectedWallet(WalletTypeEnum.POLKADOT)}
                      className={
                        currentNetwork?.id !== NetworkIdEnum.POLKADOT
                          ? styles.walletCardDisabled
                          : ''
                      }>
                      <div className={styles.rowCard}>
                        {walletIcons['polkadot']}
                        <Typography>Polkadot.js</Typography>
                      </div>
                    </ListItem>
                  </Grid>
                </ShowIf>
              </Grid>
            </div>

            <SelectServer page="login" onSwitchInstance={handleSwitchInstance} />

            <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
              <Button variant="outlined" color="secondary" onClick={() => navigate('/')}>
                Back
              </Button>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                disabled={!extensionChecked || walletType === null}
                onClick={handleConnect}>
                {i18n.t('Login.Options.Connect')}
              </Button>
            </div>
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
              currentNetwork?.id === NetworkIdEnum.POLKADOT
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
      </ShowIf>
    </ShowIf>
  );
};
