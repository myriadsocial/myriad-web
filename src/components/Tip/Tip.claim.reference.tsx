import React, { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import { Typography, Button } from '@material-ui/core';

import { BN, BN_ZERO } from '@polkadot/util';

import { useStyles } from './tip.style';

import { formatBalance } from 'src/helpers/balance';
import { TipsResult } from 'src/interfaces/blockchain-interface';
import i18n from 'src/locale';

const TipTotal = dynamic(() => import('../TotalTips/TipTotal'), {
  ssr: false,
});

type TipClaimReferenceProps = {
  networkId: string;
  token?: string;
  txFee?: BN;
  tipsResults: TipsResult[];
  onHandleVerifyRef: (
    networkId: string,
    nativeBalance: string | number,
  ) => void;
};

export const TipClaimReference: React.FC<TipClaimReferenceProps> = ({
  networkId,
  tipsResults,
  onHandleVerifyRef,
  txFee = BN_ZERO,
  token = '',
}) => {
  const style = useStyles();
  const [isShowModalTotalTips, setIsShowModalTotalTips] =
    useState<boolean>(false);
  const [fee, setFee] = useState<number>(0);

  const onVerifyReference = () => {
    const tip = tipsResults.find(
      item => item.tipsBalanceInfo.ftIdentifier === 'native',
    );
    const nativeBalance = tip ? tip.amount : '0.000';

    onHandleVerifyRef(networkId, nativeBalance);
  };

  useEffect(() => {
    // FIXME: use dynamic fee
    if (txFee) {
      setFee(formatBalance(txFee, 18, 10));
    }
  }, []);

  return (
    <>
      <div className={style.contentReference}>
        <Typography variant="h4" className={style.title} component="p">
          {i18n.t('Wallet.Tip.Reference.Title')}
        </Typography>
        <Typography
          variant="body1"
          className={style.desc}
          color="textPrimary"
          component="p">
          {i18n.t('Wallet.Tip.Reference.Desc', { fee, token })}
        </Typography>
        <Button
          onClick={onVerifyReference}
          size="small"
          color="primary"
          variant="contained">
          {i18n.t('Wallet.Tip.Reference.Button')}
        </Button>
        <div style={{ marginTop: 8 }}>
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
