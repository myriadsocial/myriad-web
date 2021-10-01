import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useStyles} from '.';
import FullVectorIcon from '../../images/Icons/FullVectorIcon.svg';
import TripleDoubleDotsIcon from '../../images/Icons/TripleDoubleDotsIcon.svg';
import {BalanceDetail} from '../MyWallet/';
import {CustomAvatar, CustomAvatarSize} from '../atoms/Avatar';

type DraggableBalanceCardProps = {
  balanceDetail: BalanceDetail;
  index: number;
};

export const DraggableBalanceCard: React.FC<DraggableBalanceCardProps> = props => {
  const {balanceDetail, index} = props;
  const classes = useStyles();

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
            <div>
              <Typography variant="body1" style={{fontWeight: 'bold'}}>
                {balanceDetail.freeBalance}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {'USD 15.25'}
              </Typography>
            </div>

            <SvgIcon
              style={index === 0 ? {transform: 'rotate(180deg)'} : {transform: 'rotate(0deg)'}}
              component={FullVectorIcon}
              viewBox="0 0 18 20"
            />

            <SvgIcon component={TripleDoubleDotsIcon} viewBox="0 0 18 20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
