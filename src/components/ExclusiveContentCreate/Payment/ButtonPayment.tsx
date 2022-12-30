import {GiftIcon} from '@heroicons/react/outline';

import {useState} from 'react';
import {useSelector} from 'react-redux';

import {Button, SvgIcon} from '@material-ui/core';

import {useStyles} from './Payment.style';

import {PromptComponent} from 'components/atoms/Prompt/prompt.component';
import useBlockchain from 'components/common/Blockchain/use-blockchain.hook';
import {PriceUnlockableContent} from 'components/common/Tipping/Tipping.interface';
import useTipping from 'components/common/Tipping/use-tipping.hook';
import {Currency} from 'src/interfaces/currency';
import {ReferenceType} from 'src/interfaces/interaction';
import {Network} from 'src/interfaces/network';
import {getPriceExclusiveContent, getWalletAddressExclusive} from 'src/lib/api/post';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const ButtonPayment = ({url, contentId}: {url: string; contentId: string}) => {
  const {currentWallet, user} = useSelector<RootState, UserState>(state => state.userState);
  const {switchNetwork} = useBlockchain();
  const tipping = useTipping();
  const styles = useStyles();
  const [openSwitchNetwork, setOpenSwitchNetwork] = useState<boolean>(false);
  const [acceptNetwork, setAcceptNetwork] = useState<Currency>();

  const handlePayExclusiveContent = async (url: string) => {
    try {
      const detail = await getPriceExclusiveContent(url);
      setAcceptNetwork((detail as unknown as PriceUnlockableContent).prices[0]?.currency);

      if (
        currentWallet?.networkId !==
        (detail as unknown as PriceUnlockableContent).prices[0]?.currency?.networkId
      ) {
        console.log(user);
        handleNetworkError();
        return;
      }

      const walletAddress = await getWalletAddressExclusive(detail?.id);

      tipping.send({
        receiver: {...detail?.user, walletDetail: walletAddress},
        reference: detail,
        referenceType: ReferenceType.EXCLUSIVE_CONTENT,
        currencyContent: (detail as unknown as PriceUnlockableContent).prices[0]?.currency,
        referenceId: `${detail?.id}/${contentId}`,
      });
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

  return (
    <>
      <Button
        className={styles.buttonPayment}
        variant="contained"
        startIcon={<SvgIcon component={GiftIcon} viewBox="0 0 24 24" />}
        onClick={() => handlePayExclusiveContent(url)}>
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
    </>
  );
};

export default ButtonPayment;
