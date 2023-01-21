import {GiftIcon} from '@heroicons/react/outline';

import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Button, SvgIcon} from '@material-ui/core';

import {useStyles} from './Payment.style';

import {PromptComponent} from 'components/atoms/Prompt/prompt.component';
import useBlockchain from 'components/common/Blockchain/use-blockchain.hook';
import {ExclusiveContent} from 'components/common/Tipping/Tipping.interface';
import useTipping from 'components/common/Tipping/use-tipping.hook';
import {useUserHook} from 'src/hooks/use-user.hook';
import {Currency} from 'src/interfaces/currency';
import {ReferenceType} from 'src/interfaces/interaction';
import {Network} from 'src/interfaces/network';
import {getExclusiveContent, getWalletAddressExclusive} from 'src/lib/api/post';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {ECState} from 'src/reducers/exclusive-content/reducer';
import {UserState} from 'src/reducers/user/reducer';

const ButtonPayment = ({
  id,
  contentId,
  setExclusive,
}: {
  id: string;
  contentId: string;
  setExclusive: Dispatch<SetStateAction<ExclusiveContent>>;
}) => {
  const {currentWallet} = useSelector<RootState, UserState>(state => state.userState);
  const {paid, ecId} = useSelector<RootState, ECState>(state => state.ecState);
  const {user} = useUserHook();
  const {switchNetwork} = useBlockchain();
  const router = useRouter();

  const tipping = useTipping();
  const styles = useStyles();
  const [openSwitchNetwork, setOpenSwitchNetwork] = useState<boolean>(false);
  const [acceptNetwork, setAcceptNetwork] = useState<Currency>();
  const [tipInfoOpened, setTipInfoOpened] = useState<boolean>(false);
  const [prompWeb2Users, setPrompWeb2Users] = useState<boolean>(false);

  const anonymous = useSelector<RootState, boolean>(
    state => state.userState.anonymous,
    shallowEqual,
  );
  const {wallets} = user || {wallets: []};
  const isWeb2Users = !wallets.length && !anonymous;

  const handleCloseTipInfo = () => {
    setTipInfoOpened(false);
  };

  const handleLogin = () => {
    router.push(`/login`);
  };

  const handleCloseConnectWalletWarningPrompt = () => {
    setPrompWeb2Users(false);
  };

  const handleConnectWeb3Wallet = () => {
    router.push(`/wallet?type=manage`);
  };

  const handlePayExclusiveContent = async (id: string) => {
    if (anonymous) return setTipInfoOpened(true);
    if (isWeb2Users) return setPrompWeb2Users(true);

    try {
      const exclusiveDetail = await getExclusiveContent(id, true);

      if (exclusiveDetail?.content) {
        setExclusive(exclusiveDetail);
      } else {
        setAcceptNetwork(exclusiveDetail.prices[0]?.currency);
        if (currentWallet?.networkId !== exclusiveDetail.prices[0]?.currency?.networkId) {
          return handleNetworkError();
        }
        const walletAddress = await getWalletAddressExclusive(exclusiveDetail?.id);
        tipping.send({
          receiver: {...exclusiveDetail?.user, walletDetail: walletAddress},
          reference: exclusiveDetail,
          referenceType: ReferenceType.EXCLUSIVE_CONTENT,
          currencyContent: exclusiveDetail.prices[0]?.currency,
          referenceId: `${exclusiveDetail?.id}/${contentId}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNetworkError = () => {
    setOpenSwitchNetwork(!openSwitchNetwork);
  };

  const handleSwitchNetwork = async (network: Network) => {
    handleNetworkError();
    switchNetwork(network);
  };

  useEffect(() => {
    if (paid && ecId === id) {
      handlePayExclusiveContent(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paid]);

  return (
    <>
      <Button
        className={styles.buttonPayment}
        variant="contained"
        startIcon={<SvgIcon component={GiftIcon} viewBox="0 0 24 24" />}
        onClick={() => handlePayExclusiveContent(id)}>
        {i18n.t('ExclusiveContent.Available')}
      </Button>
      <PromptComponent
        icon="warning"
        title={i18n.t('ExclusiveContent.Label.NetworkError')}
        subtitle={i18n.t('ExclusiveContent.Text.NetworkError', {
          accept: acceptNetwork?.networkId,
          current: currentWallet?.networkId,
        })}
        open={openSwitchNetwork}
        onCancel={handleNetworkError}>
        <div className={styles.wrapperButtonFlex}>
          <Button variant="outlined" color="secondary" onClick={handleNetworkError}>
            {i18n.t('General.Cancel')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSwitchNetwork(acceptNetwork.network)}>
            {i18n.t('ExclusiveContent.Label.SwitchNetwork')}
          </Button>
        </div>
      </PromptComponent>
      <PromptComponent
        icon="warning"
        title={i18n.t('Tipping.Prompt_Web2.Title')}
        subtitle={i18n.t('ExclusiveContent.Text.NotLogin')}
        open={tipInfoOpened}
        onCancel={handleCloseTipInfo}>
        <div className={styles.wrapperButtonFlex}>
          <Button variant="outlined" color="secondary" onClick={handleCloseTipInfo}>
            {i18n.t('General.Cancel')}
          </Button>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            {i18n.t('Login.Layout.Btn_Signin')}
          </Button>
        </div>
      </PromptComponent>

      <PromptComponent
        icon="warning"
        title={i18n.t('Tipping.Prompt_Web2.Title')}
        subtitle={i18n.t('ExclusiveContent.Text.Web2User')}
        open={prompWeb2Users}
        onCancel={handleCloseConnectWalletWarningPrompt}>
        <div className={styles.wrapperButtonFlex}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCloseConnectWalletWarningPrompt}>
            {i18n.t('General.Cancel')}
          </Button>
          <Button variant="contained" color="primary" onClick={handleConnectWeb3Wallet}>
            {i18n.t('General.ConnectWallet')}
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};

export default ButtonPayment;
