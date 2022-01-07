import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useStyles} from '.';
import FullVectorIcon from '../../images/Icons/FullVectorIcon.svg';
import TripleDoubleDotsIcon from '../../images/Icons/TripleDoubleDotsIcon.svg';
import {BalanceDetail} from '../MyWallet';
import {CustomAvatar, CustomAvatarSize} from '../atoms/Avatar';

import {formatUsd} from 'src/helpers/balance';
import {useExchangeRate} from 'src/hooks/use-exchange-rate.hook';

type DraggableBalanceCardProps = {
  balanceDetail: BalanceDetail;
  index: number;
  onClick: (index: number) => void;
};

export const DraggableBalanceCard: React.FC<DraggableBalanceCardProps> = props => {
  const {balanceDetail, index, onClick} = props;
  const classes = useStyles();

  const {loading, exchangeRates} = useExchangeRate();

  const getConversion = (currencyId: string) => {
    if (loading) {
      return 0;
    }

    const found = exchangeRates.find(exchangeRate => exchangeRate.id === currencyId);

    if (found) return found.price;
    return 0;
  };

  const handleOnClick = () => {
    onClick(index);
  };

  return (
    <Card className={classes.cardRoot}>
      <CardContent>
        <div className={classes.cardContentWrapper}>
          <div className={classes.leftJustifiedWrapper}>
            <CustomAvatar
              size={CustomAvatarSize.MEDIUM}
              alt={balanceDetail.id ?? 'Coin'}
              avatar={balanceDetail.image}
            />
            <Typography variant="body1" style={{fontWeight: 'bold'}}>
              {balanceDetail.id}
            </Typography>
          </div>

          <div className={classes.rightJustifiedWrapper}>
            <div style={{textAlign: 'right'}}>
              <Typography variant="body1" style={{fontWeight: 'bold'}}>
                {balanceDetail.freeBalance}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {`~${formatUsd(balanceDetail.freeBalance, getConversion(balanceDetail.id))} USD`}
              </Typography>
            </div>

            <SvgIcon
              style={index === 0 ? {transform: 'rotate(180deg)'} : {transform: 'rotate(0deg)'}}
              component={FullVectorIcon}
              className={classes.cursor}
              onClick={handleOnClick}
              viewBox="0 0 20 20"
            />

            <SvgIcon component={TripleDoubleDotsIcon} viewBox="0 0 18 20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
