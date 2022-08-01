import React, {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';
import {useDispatch} from 'react-redux';

import {Session} from 'next-auth';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {Container} from '@material-ui/core';

import useStyles from './DefaultLayout.styles';

import {BlockchainProvider as BlockchainProviderComponent} from 'components/common/Blockchain/Blockchain.provider';
import {withError, WithErrorProps} from 'src/components/Error';
import {MenuContainer} from 'src/components/Menu';
import {NotificationsContainer} from 'src/components/Notifications';
import {RightMenuBar} from 'src/components/RightMenuBar/RightMenuBar';
import {CookieConsent, COOKIE_CONSENT_NAME} from 'src/components/common/CookieConsent';
import {TippingProvider} from 'src/components/common/Tipping/Tipping.provider';
import ShowIf from 'src/components/common/show-if.component';
import {useUserHook} from 'src/hooks/use-user.hook';
import {IProvider} from 'src/interfaces/blockchain-interface';
import {NetworkIdEnum} from 'src/interfaces/network';
import {NotificationProps} from 'src/interfaces/notification';
import {BlockchainPlatform, WalletTypeEnum} from 'src/interfaces/wallet';
import {Server} from 'src/lib/api/server';
import * as FirebaseAnalytic from 'src/lib/firebase/analytic';
import * as FirebaseMessaging from 'src/lib/firebase/messaging';
import {BlockchainProvider} from 'src/lib/services/blockchain-provider';
import {Near} from 'src/lib/services/near-api-js';
import {clearBalances, loadBalances} from 'src/reducers/balance/actions';
import {countNewNotification, processNotification} from 'src/reducers/notification/actions';
import {fetchUserWalletAddress} from 'src/reducers/user/actions';

const WalletBalancesContainer = dynamic(
  () => import('../../WalletBalance/WalletBalanceContainer'),
  {
    ssr: false,
  },
);

const ProfileCardContainer = dynamic(
  () => import('src/components/ProfileCard/ProfileCard.container'),
  {
    ssr: false,
  },
);

const SocialMediaListContainer = dynamic(
  () => import('src/components/SocialMediaList/SocialMediaList.container'),
  {
    ssr: false,
  },
);

type DefaultLayoutProps = WithErrorProps & {
  isOnProfilePage: boolean;
  children: React.ReactNode;
  logo: string;
  session: Session;
  server?: Server;
};

const Default: React.FC<DefaultLayoutProps> = props => {
  const {children, logo} = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();

  const [cookies] = useCookies([COOKIE_CONSENT_NAME]);
  const {user, anonymous, currentWallet, updateUserFcmToken} = useUserHook();

  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [provider, setProvider] = useState<IProvider>(null);
  const [nearProvider, setNearProvider] = useState<Near>(null);
  const [initialize, setInitialize] = useState<boolean>(true);

  const loadingNear = router.query.loading as string | null;

  useEffect(() => {
    if (anonymous) return;
    if (loadingNear) dispatch(clearBalances());

    if (currentWallet?.network && initialize && !provider && !loadingNear) {
      if (nearProvider && currentWallet.networkId === NetworkIdEnum.NEAR) {
        initializeBlockchain(nearProvider, currentWallet.id);
      } else {
        BlockchainProvider.connect(currentWallet.network).then(blockchain => {
          if (blockchain?.provider?.constructor.name === 'Near') setNearProvider(blockchain.Near);
          initializeBlockchain(blockchain?.provider, currentWallet.id);
        });
      }
    }
  }, [currentWallet, initialize, provider, loadingNear]);

  useEffect(() => {
    if (user) {
      initializeFirebase();
    }
  }, [user]);

  const initializeBlockchain = (provider: IProvider, walletId: string) => {
    if (provider) provider.accountId = walletId;

    setProvider(provider);
    dispatch(loadBalances(provider, true));
    dispatch(fetchUserWalletAddress(provider, walletId));
    setInitialize(false);
  };

  const processMessages = (payload?: NotificationProps) => {
    dispatch(countNewNotification());

    if (payload) {
      dispatch(processNotification(payload));
    }
  };

  const initializeFirebase = async () => {
    const token = await FirebaseMessaging.init(processMessages);

    if (!user?.deletedAt) {
      await updateUserFcmToken(token);
    }

    if (cookies[COOKIE_CONSENT_NAME]) {
      await FirebaseAnalytic.init();
    }
  };

  const handleToggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const reinitializeBlockchain = async () => {
    if (provider?.constructor.name === 'PolkadotJs') await provider.disconnect();
    setInitialize(true);
    setProvider(null);
  };

  const getWallet = (blockchainPlatform?: BlockchainPlatform) => {
    switch (blockchainPlatform) {
      case BlockchainPlatform.SUBSTRATE:
        return WalletTypeEnum.POLKADOT;

      case BlockchainPlatform.NEAR:
        return WalletTypeEnum.NEAR;

      default:
        return;
    }
  };

  return (
    <BlockchainProviderComponent
      provider={provider}
      nearProvider={nearProvider}
      currentWallet={currentWallet}
      onChangeProvider={reinitializeBlockchain}
      loadingBlockchain={initialize}>
      <TippingProvider
        anonymous={anonymous}
        sender={user}
        currentWallet={getWallet(currentWallet?.network?.blockchainPlatform)}
        currentNetwork={currentWallet?.networkId}>
        <Container maxWidth="lg" disableGutters>
          <div className={classes.root}>
            <div className={classes.firstCol}>
              <div className={classes.innerFirstColWrapper}>
                <div>
                  <MenuContainer logo={logo} />
                </div>
                <div>
                  <SocialMediaListContainer />
                </div>
                <div>
                  <WalletBalancesContainer />
                </div>
              </div>
            </div>

            <div className={classes.secondCol}>
              <div className={classes.innerSecondColWrapper}>{children}</div>
            </div>

            <div className={classes.thirdCol}>
              <div className={classes.innerThirdColWrapper}>
                <ProfileCardContainer toggleNotification={handleToggleNotification} />

                <ShowIf condition={!showNotification}>
                  <RightMenuBar />
                </ShowIf>

                <ShowIf condition={showNotification}>
                  <NotificationsContainer infinite={false} size="small" />
                </ShowIf>
              </div>
            </div>
          </div>
        </Container>

        <CookieConsent />
      </TippingProvider>
    </BlockchainProviderComponent>
  );
};

export const DefaultLayout = withError(Default);
