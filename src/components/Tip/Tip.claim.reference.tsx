import React, {useState} from 'react';

import {useSession} from 'next-auth/react';
import dynamic from 'next/dynamic';

import {Typography, Button} from '@material-ui/core';

import {useStyles} from './tip.style';

import {CurrencyWithTips, NetworkIdEnum} from 'src/interfaces/network';
import i18n from 'src/locale';

const TipTotal = dynamic(() => import('../TotalTips/TipTotal'), {
  ssr: false,
});

type TipClaimReferenceProps = {
  token?: string;
  txFee?: string;
  tipsResults: CurrencyWithTips[];
  onHandleVerifyRef: (networkId: string) => void;
};

export const TipClaimReference: React.FC<TipClaimReferenceProps> = ({
  tipsResults,
  onHandleVerifyRef,
  txFee = '0.00',
  token = '',
}) => {
  const style = useStyles();

  const {data: session} = useSession();

  const [isShowModalTotalTips, setIsShowModalTotalTips] = useState<boolean>(false);

  const networkId = session?.user?.networkType as NetworkIdEnum;

  const onVerifyReference = () => {
    if (!networkId) return;
    onHandleVerifyRef(networkId);
  };

  return (
    <>
      <div className={style.contentReference}>
        <Typography variant="h4" className={style.title} component="p">
          {i18n.t('Wallet.Tip.Reference.Title')}
        </Typography>
        <Typography variant="body1" className={style.desc} color="textPrimary" component="p">
          {i18n.t('Wallet.Tip.Reference.Desc', {txFee, token})}
        </Typography>
        <Button onClick={onVerifyReference} size="small" color="primary" variant="contained">
          {i18n.t('Wallet.Tip.Reference.Button')}
        </Button>
        <div style={{marginTop: 8}}>
          <Button
            onClick={() => setIsShowModalTotalTips(true)}
            size="small"
            color="primary"
            variant="text">
            {i18n.t('Wallet.Tip.Reference.Button_View')}
          </Button>
        </div>
      </div>
      <TipTotal
        handleVerifyReference={onVerifyReference}
        tipsResults={tipsResults}
        open={isShowModalTotalTips}
        onClose={() => setIsShowModalTotalTips(false)}
      />
    </>
  );
};
