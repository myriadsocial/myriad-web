import {GiftIcon} from '@heroicons/react/outline';

import {Button, SvgIcon} from '@material-ui/core';

import {useStyles} from './Payment.style';

import {PriceUnlockableContent} from 'components/common/Tipping/Tipping.interface';
import useTipping from 'components/common/Tipping/use-tipping.hook';
import {ReferenceType} from 'src/interfaces/interaction';
import {getPriceExclusiveContent, getWalletAddressExclusive} from 'src/lib/api/post';
import i18n from 'src/locale';

const ButtonPayment = ({url}: {url: string}) => {
  const tipping = useTipping();
  const styles = useStyles();

  const handlePayExclusiveContent = async (url: string) => {
    try {
      const detail = await getPriceExclusiveContent(url);

      const walletAddress = await getWalletAddressExclusive(detail?.id);

      tipping.send({
        receiver: {...detail?.user, walletDetail: walletAddress},
        reference: detail,
        referenceType: ReferenceType.EXCLUSIVE_CONTENT,
        currencyContent: (detail as unknown as PriceUnlockableContent).prices[0]?.currency,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      className={styles.buttonPayment}
      variant="contained"
      startIcon={<SvgIcon component={GiftIcon} viewBox="0 0 24 24" />}
      onClick={() => handlePayExclusiveContent(url)}>
      {i18n.t('ExclusiveContent.Available')}
    </Button>
  );
};

export default ButtonPayment;
