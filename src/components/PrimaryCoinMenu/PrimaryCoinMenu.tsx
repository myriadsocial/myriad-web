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
import {useCurrency} from 'src/hooks/use-currency.hook';
import {BalanceDetail} from 'src/interfaces/balance';
import i18n from 'src/locale';

type PrimaryCoinMenuProps = {
  balanceDetails: BalanceDetail[];
  togglePrimaryCoinMenu: () => void;
  user: User;
  networkId: string;
};

export const PrimaryCoinMenu: React.FC<PrimaryCoinMenuProps> = props => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const {togglePrimaryCoinMenu, balanceDetails, user, networkId} = props;
  const classes = useStyles();

  const enqueueSnackbar = useEnqueueSnackbar();
  const {updateCurrencySet} = useCurrency();

  const [coins, updateCoins] = useState(balanceDetails);

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
    updateCurrencySet(user.id, coins, networkId, () => {
      enqueueSnackbar({
        message: i18n.t('Wallet.Primary_Coin.Alert.Msg'),
        variant: 'success',
      });
    });

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
