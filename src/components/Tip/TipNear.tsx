import React, {useState} from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {TipTotalNear} from '../TotalTips/TipTotalNear';
import {useStyles} from './tip.style';

import {NearNetworkIcon24} from 'src/components/atoms/Icons';
import {TotalTipsDataInterface} from 'src/interfaces/network';
import i18n from 'src/locale';

type TipNearProps = {
  handleVerifyReference: (currentBalance: string | number) => void;
  handleClaimAll: () => void;
  totalTipsData: Array<TotalTipsDataInterface>;
};

export const TipNear: React.FC<TipNearProps> = props => {
  const {handleVerifyReference, totalTipsData, handleClaimAll} = props;
  const style = useStyles();
  const [isShowModalTotalTips, setIsShowModalTotalTips] = useState<boolean>(false);
  const onVerifyReference = () => {
    const tip = totalTipsData.find(item => item.tipsBalanceInfo.ftIdentifier === 'native');
    const currentBalance = tip ? tip.amount : '0.000';

    handleVerifyReference(currentBalance);
  };

  return (
    <>
      <div className={style.flex}>
        <div className={style.flex}>
          <NearNetworkIcon24 width={'24px'} height={'24px'} />
          <Typography variant="h6" component="span" color="textPrimary">
            NEAR
          </Typography>
        </div>
        <Button
          className={style.button}
          size="small"
          color="default"
          variant="text"
          onClick={handleClaimAll}>
          {i18n.t('Wallet.Tip.Claim_All')}
        </Button>
      </div>
      <div className={style.contentReference}>
        <Typography variant="h4" className={style.title} component="p">
          {i18n.t('Wallet.Tip.Reference.Title')}
        </Typography>
        <Typography variant="body1" className={style.desc} color="textPrimary" component="p">
          {i18n.t('Wallet.Tip.Reference.Desc')}
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
            View total Tips
          </Button>
        </div>
      </div>
      <TipTotalNear
        handleVerifyReference={onVerifyReference}
        totalTipsData={totalTipsData}
        open={isShowModalTotalTips}
        onClose={() => setIsShowModalTotalTips(false)}
      />
    </>
  );
};
