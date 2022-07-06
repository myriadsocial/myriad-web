import React, {useState} from 'react';
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';

import {useMediaQuery, useTheme} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

import {useStyles} from '.';
import {User} from '../../interfaces/user';
import {Button, ButtonVariant, ButtonColor} from '../atoms/Button';
import {DraggableBalanceCard} from './DraggableBalanceCard';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import remove from 'lodash/remove';
import {useCurrency} from 'src/hooks/use-currency.hook';
import {BalanceDetail} from 'src/interfaces/balance';
import {CurrencyId} from 'src/interfaces/currency';
import i18n from 'src/locale';

type PrimaryCoinMenuProps = {
  balanceDetails: BalanceDetail[];
  togglePrimaryCoinMenu: () => void;
  user: User;
  currenciesId: string[];
};

export const PrimaryCoinMenu: React.FC<PrimaryCoinMenuProps> = props => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const {togglePrimaryCoinMenu, balanceDetails, user, currenciesId} = props;
  const classes = useStyles();

  const enqueueSnackbar = useEnqueueSnackbar();
  const {updateCurrencySet} = useCurrency();

  const initialCoinState = () => {
    const data: BalanceDetail[] = [];

    if (currenciesId.length) {
      balanceDetails.forEach(coin => {
        data[currenciesId.indexOf(coin.id)] = coin;
      });
    } else {
      // TODO: check default wallet
      // return putDefaultFirst(balanceDetails, currentWallet.id);
    }

    return data;
  };

  const putDefaultFirst = (balanceDetails: BalanceDetail[], defaultCurrencyId: CurrencyId) => {
    const newDefaultCoins = [...balanceDetails];

    const defaultCoin = remove(newDefaultCoins, function (n) {
      return n.id === defaultCurrencyId;
    });

    const resultDefaultCoins = [...defaultCoin, ...newDefaultCoins];

    return resultDefaultCoins;
  };

  const [coins, updateCoins] = useState(initialCoinState());

  const handleOnDragEnd = ({source, destination}: DropResult) => {
    // Handle if dragging out of bounds
    if (!destination) return;

    const items = Array.from(coins);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    updateCoins(items);
  };

  const handleMoveCoin = (index: number) => {
    const items = Array.from(coins);
    const [reorderedItem] = items.splice(index, 1);

    if (index !== 0) items.splice(index - 1, 0, reorderedItem);
    else items.splice(1, 0, reorderedItem);

    updateCoins(items);
  };

  const handleSetDefaultCurrency = () => {
    const currencyId = coins[0].id as CurrencyId;
    const coinsId = coins.map(coin => coin.id);

    updateCurrencySet(user.id, coinsId, () => {
      enqueueSnackbar({
        message: i18n.t('Wallet.Primary_Coin.Alert.Msg'),
        variant: 'success',
      });
    });

    updateCoins(putDefaultFirst(balanceDetails, currencyId));
    togglePrimaryCoinMenu();
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.innerRoot}>
          {isMobile ? (
            <div className={classes.primaryCoinWrapper}>
              <Typography variant="body1" color="textSecondary">
                {i18n.t('Wallet.Primary_Coin.Text_2')}
              </Typography>
              <div className={classes.title}>
                <Typography variant="body1" style={{fontWeight: 'bold'}}>
                  {i18n.t('Wallet.Primary_Coin.Text_1')}
                </Typography>
              </div>
            </div>
          ) : (
            <div className={classes.primaryCoinWrapper}>
              <Typography variant="body1" style={{fontWeight: 'bold'}}>
                {i18n.t('Wallet.Primary_Coin.Text_1')}
              </Typography>
              <div style={{marginLeft: 'auto'}}>
                <Typography variant="body1" color="textSecondary">
                  {i18n.t('Wallet.Primary_Coin.Text_2')}
                </Typography>
              </div>
            </div>
          )}

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="balanceCard">
              {provided => (
                <List
                  className={classes.listRoot}
                  {...provided.droppableProps}
                  ref={provided.innerRef}>
                  {provided.placeholder}
                  {coins.map((coin, index) => {
                    return (
                      <Draggable key={coin.id} draggableId={coin.id} index={index}>
                        {provided =>
                          index === 1 ? (
                            <>
                              <div className={classes.title}>
                                <Typography variant="body1" style={{fontWeight: 'bold'}}>
                                  Favorite coin
                                </Typography>
                              </div>
                              <ListItem
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
                                <DraggableBalanceCard
                                  balanceDetail={coin}
                                  index={index}
                                  onClick={handleMoveCoin}
                                />
                              </ListItem>
                            </>
                          ) : (
                            <>
                              <ListItem
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
                                <DraggableBalanceCard
                                  balanceDetail={coin}
                                  index={index}
                                  onClick={handleMoveCoin}
                                />
                              </ListItem>
                            </>
                          )
                        }
                      </Draggable>
                    );
                  })}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className={classes.balanceTabActions}>
          <Button
            onClick={togglePrimaryCoinMenu}
            variant={ButtonVariant.OUTLINED}
            color={ButtonColor.SECONDARY}>
            {i18n.t('General.Cancel')}
          </Button>
          <Button onClick={handleSetDefaultCurrency} variant={ButtonVariant.CONTAINED}>
            {i18n.t('General.Save')}
          </Button>
        </div>
      </div>
    </>
  );
};
