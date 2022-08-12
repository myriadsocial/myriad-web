import React, {useState} from 'react';

import dynamic from 'next/dynamic';

import {Typography, Button} from '@material-ui/core';

import {useStyles} from './tip.style';

import {TipsResult} from 'src/interfaces/blockchain-interface';
import i18n from 'src/locale';

const TipTotal = dynamic(() => import('../TotalTips/TipTotal'), {
  ssr: false,
});

type TipClaimReferenceProps = {
  networkId: string;
  token?: string;
  txFee?: string;
  tipsResults: TipsResult[];
  onHandleVerifyRef: (networkId: string, nativeBalance: string | number) => void;
};

export const TipClaimReference: React.FC<TipClaimReferenceProps> = ({
  networkId,
  tipsResults,
  onHandleVerifyRef,
  txFee = '0.00',
  token = '',
}) => {
  const style = useStyles();
  const [isShowModalTotalTips, setIsShowModalTotalTips] = useState<boolean>(false);

  const onVerifyReference = () => {
    const tip = tipsResults.find(item => item.tipsBalanceInfo.ftIdentifier === 'native');
    const nativeBalance = tip ? tip.amount : '0.000';

    onHandleVerifyRef(networkId, nativeBalance);
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
