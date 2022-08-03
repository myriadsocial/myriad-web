import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import {Backdrop, CircularProgress, NoSsr} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {BoxComponent} from '../atoms/Box';
import {ShimerComponent} from './Shimer';
import {Tip} from './Tip';
import {useStyles} from './tip.style';

import useBlockchain from 'components/common/Blockchain/use-blockchain.hook';
import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {VariantType} from 'notistack';
import {Empty} from 'src/components/atoms/Empty';
import {getServerId} from 'src/helpers/wallet';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useClaimTip} from 'src/hooks/use-claim-tip.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {TipsBalanceInfo, TipsResult} from 'src/interfaces/blockchain-interface';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const PolkadotAccountList = dynamic(
  () => import('components/PolkadotAccountList/PolkadotAccountList'),
  {
    ssr: false,
  },
);

export const TipContainer: React.FC = () => {
  const enqueueSnackbar = useEnqueueSnackbar();
  const styles = useStyles();

  const {
    loading,
    claiming,
    claimingAll,
    verifyingReference,
    tipsEachNetwork,
    claim,
    claimAll,
    feeInfo,
    server,
    isSignerLoading,
    payTransactionFee,
  } = useClaimTip();

  const {loadingSwitch, switchNetwork} = useBlockchain();
  const {currentWallet, user} = useSelector<RootState, UserState>(state => state.userState);
  const {enablePolkadotExtension} = usePolkadotExtension();
  const {getRegisteredAccounts} = useAuthHook();

  const [showAccountList, setShowAccountList] = useState<boolean>(false);
  const [extensionInstalled, setExtensionInstalled] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [tipsBalanceInfo, setTipsBalanceInfo] = useState<TipsBalanceInfo>(null);

  const handleClaimTip = (networkId: string, ftIdentifier: string) => {
    claim(networkId, ftIdentifier, ({claimSuccess, errorMessage}) => {
      if (networkId === NetworkIdEnum.MYRIAD) {
        // TODO: Register translation
        const variant = claimSuccess ? 'success' : 'warning';
        const message = claimSuccess ? i18n.t('Wallet.Tip.Alert.Success') : errorMessage;

        enqueueSnackbar({message, variant});
      }
    });
  };

  const handleClaimTipAll = (networkId: string) => {
    claimAll(networkId, ({claimSuccess, errorMessage}) => {
      if (networkId === NetworkIdEnum.MYRIAD) {
        // TODO: Register translation
        const variant = claimSuccess ? 'success' : 'warning';
        const message = claimSuccess ? i18n.t('Wallet.Tip.Alert.Success') : errorMessage;

        enqueueSnackbar({message, variant});
      }
    });
  };

  const tipWithBalances = (network: Network) => {
    return network?.tips.filter(tip => Math.ceil(Number(tip.amount)) > 0) ?? [];
  };

  const isShow = (network: Network) => {
    if (network.id === currentWallet?.networkId) return true;
    return false;
  };

  const handleVerifyReference = async (networkId: string, nativeBalance: string | number) => {
    if (!user?.id) return;

    try {
      if (parseInt(feeInfo.trxFee) <= 0) {
        throw new Error('Insufficient Gas Fee');
      }

      if (!server) throw new Error('Server not exists');

      const serverId = getServerId(server, currentWallet?.networkId);
      const tipsBalanceInfo = {
        serverId: serverId,
        referenceType: 'user',
        referenceId: user.id,
        ftIdentifier: 'native',
      };

      switch (networkId) {
        case NetworkIdEnum.NEAR: {
          await payTransactionFee(tipsBalanceInfo, feeInfo.trxFee, nativeBalance.toString());
          break;
        }

        case NetworkIdEnum.MYRIAD: {
          checkExtensionInstalled();
          setTipsBalanceInfo(tipsBalanceInfo);
          break;
        }

        default:
          return;
      }
    } catch (error) {
      // TODO: Register Translation
      enqueueSnackbar({
        message: error.message,
        variant: 'error',
      });
    }
  };

  const closeAccountList = () => {
    setShowAccountList(false);
  };

  const checkExtensionInstalled = async () => {
    const installed = await enablePolkadotExtension();

    setShowAccountList(true);
    setExtensionInstalled(installed);

    getAvailableAccounts();
  };

  const getAvailableAccounts = async () => {
    const accounts = await getRegisteredAccounts();

    setAccounts(accounts);
  };

  const handleConnect = async (account?: InjectedAccountWithMeta) => {
    closeAccountList();

    if (!account) return;

    let message = 'Claiming Reference Success';
    let variant: VariantType = 'success';

    try {
      await payTransactionFee(tipsBalanceInfo, feeInfo.trxFee, undefined, account);
    } catch (error) {
      variant = error.message === 'Cancelled' ? 'warning' : 'error';
      message = error.message;
    } finally {
      setTipsBalanceInfo(null);

      enqueueSnackbar({variant, message});
    }
  };

  const getNativeToken = (tips: TipsResult[]) => {
    const native = tips.find(tip => tip?.tipsBalanceInfo?.ftIdentifier === 'native');
    if (native) return native.symbol;
    return '';
  };

  const showNetwork = (network: Network) => {
    const tipsBalances = tipWithBalances(network);
    const nativeToken = getNativeToken(network?.tips ?? []);

    if (!tipsBalances.length) {
      if (!isShow(network)) return;
      switch (network.id) {
        case NetworkIdEnum.MYRIAD:
        case NetworkIdEnum.NEAR:
          return (
            <div style={{marginTop: 20}} key={network.id}>
              <Empty
                title={i18n.t('Wallet.Tip.Empty.Title')}
                subtitle={i18n.t('Wallet.Tip.Empty.Subtitle')}
              />
            </div>
          );
        default:
          return;
      }
    }

    return (
      <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'} key={network.id}>
        {showTip(network, tipsBalances, nativeToken)}
      </BoxComponent>
    );
  };

  const showTip = (network: Network, tipsBalances: TipsResult[], token: string) => {
    if ((claimingAll || verifyingReference) && isShow(network)) return <ShimerComponent />;
    return (
      <Tip
        loading={claiming}
        tips={tipsBalances}
        network={network}
        currentWallet={currentWallet}
        onClaim={handleClaimTip}
        onClaimAll={handleClaimTipAll}
        onSwitchNetwork={switchNetwork}
        onHandleVerifyRef={handleVerifyReference}
        nativeToken={token}
        txFee={feeInfo.formattedTrxFee}
      />
    );
  };

  return (
    <NoSsr>
      {loading || loadingSwitch ? (
        <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
          <ShimerComponent />
        </BoxComponent>
      ) : (
        tipsEachNetwork.map(network => showNetwork(network))
      )}
      <PolkadotAccountList
        align="left"
        title="Select account"
        isOpen={showAccountList && extensionInstalled}
        accounts={accounts}
        onSelect={handleConnect}
        onClose={closeAccountList}
      />

      <Backdrop className={styles.backdrop} open={claimingAll || isSignerLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </NoSsr>
  );
};

export default TipContainer;
