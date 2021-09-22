import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

import FullVectorIcon from '../../images/Icons/FullVectorIcon.svg';
import TripleDoubleDotsIcon from '../../images/Icons/TripleDoubleDotsIcon.svg';
import {BalanceDetail} from '../MyWallet/MyWallet';
import {CustomAvatar, CustomAvatarSize} from '../atoms/avatar/';
import {Button, ButtonVariant, ButtonColor} from '../atoms/button/';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      paddingLeft: 0,
    },
    innerRoot: {
      marginTop: theme.spacing(2.5),
      marginBottom: theme.spacing(2.5),
      display: 'flex',
      flexDirection: 'column',
      rowGap: theme.spacing(1.5),
    },
    primaryCoinWrapper: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    balanceTabActions: {
      display: 'flex',
      justifyContent: 'space-between',
      columnGap: theme.spacing(2.875),
    },
    cardRoot: {
      border: '1px solid #EDEDED',
      boxSizing: 'border-box',
      borderRadius: 10,
      boxShadow: 'none',
      '& .MuiCardContent-root:last-child': {
        paddingBottom: theme.spacing(2),
      },
    },
    cardContentWrapper: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    leftJustifiedWrapper: {
      display: 'flex',
      alignItems: 'center',
      columnGap: theme.spacing(2.5),
    },
    rightJustifiedWrapper: {
      marginLeft: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      columnGap: theme.spacing(1.875),
    },
  }),
);

type PrimaryCoinMenuProps = {
  togglePrimaryCoinMenu: () => void;
  balanceDetails: BalanceDetail[];
};

export const PrimaryCoinMenu: React.FC<PrimaryCoinMenuProps> = props => {
  const {togglePrimaryCoinMenu, balanceDetails} = props;
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <div className={classes.innerRoot}>
          <div className={classes.primaryCoinWrapper}>
            <Typography variant="body1" style={{fontWeight: 'bold'}}>
              Primary coin
            </Typography>
            <div style={{marginLeft: 'auto'}}>
              <Typography variant="body1" color="textSecondary">
                Click and drag to change wallet order
              </Typography>
            </div>
          </div>

          {balanceDetails.map((balanceDetail, key) => {
            return key === 1 ? (
              <>
                <Typography variant="body1" style={{fontWeight: 'bold'}}>
                  Favorite coin
                </Typography>
                <Card className={classes.cardRoot} key={balanceDetail.id}>
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

                        <SvgIcon component={FullVectorIcon} viewBox="0 0 18 20" />

                        <SvgIcon component={TripleDoubleDotsIcon} viewBox="0 0 18 20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className={classes.cardRoot} key={balanceDetail.id}>
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
                        style={{transform: 'rotate(180deg)'}}
                        component={FullVectorIcon}
                        viewBox="0 0 18 20"
                      />

                      <SvgIcon component={TripleDoubleDotsIcon} viewBox="0 0 18 20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className={classes.balanceTabActions}>
          <Button
            onClick={togglePrimaryCoinMenu}
            variant={ButtonVariant.OUTLINED}
            color={ButtonColor.SECONDARY}>
            Cancel
          </Button>
          <Button variant={ButtonVariant.CONTAINED}>Apply Changes</Button>
        </div>
      </div>
    </>
  );
};
