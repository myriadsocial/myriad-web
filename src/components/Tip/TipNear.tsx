import React from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './tip.style';

import {NearNetworkIcon24} from 'src/components/atoms/Icons';
import i18n from 'src/locale';

type TipNearProps = {};

export const TipNear: React.FC<TipNearProps> = props => {
  const style = useStyles();

  const handleClaimAll = () => {
    return undefined;
  };

  const handleVerifyReference = () => {
    return undefined;
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
        <Button onClick={handleVerifyReference} size="small" color="primary" variant="contained">
          {i18n.t('Wallet.Tip.Reference.Button')}
        </Button>
      </div>
    </>
  );
};
