import React, {useState} from 'react';
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

import {useStyles} from '.';
import {BalanceDetail} from '../MyWallet/';
import {Button, ButtonVariant, ButtonColor} from '../atoms/Button';
import {DraggableBalanceCard} from './DraggableBalanceCard';

import _ from 'lodash';
import {CurrencyId} from 'src/interfaces/currency';

type PrimaryCoinMenuProps = {
  balanceDetails: BalanceDetail[];
  defaultCurrency: CurrencyId;
  togglePrimaryCoinMenu: () => void;
};

export const PrimaryCoinMenu: React.FC<PrimaryCoinMenuProps> = props => {
  const {togglePrimaryCoinMenu, balanceDetails, defaultCurrency} = props;
  const classes = useStyles();

  const removeMyriad = (balanceDetails: BalanceDetail[]) => {
    const newCoins = [...balanceDetails];

    const myriadlessCoins = _.remove(newCoins, function (n) {
      return n.id !== CurrencyId.MYRIA;
    });

    return myriadlessCoins;
  };

  const putDefaultFirst = (balanceDetails: BalanceDetail[]) => {
    const newDefaultCoins = [...balanceDetails];

    const defaultCoin = _.remove(newDefaultCoins, function (n) {
      return n.id === defaultCurrency;
    });

    const myriadlessCoins = removeMyriad(newDefaultCoins);

    const resultDefaultCoins = [...defaultCoin, ...myriadlessCoins];

    return resultDefaultCoins;
  };

  const [coins, updateCoins] = useState(putDefaultFirst(balanceDetails));

  console.log({coins});

  const handleOnDragEnd = ({source, destination}: DropResult) => {
    // Handle if dragging out of bounds
    if (!destination) return;

    const items = Array.from(coins);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    updateCoins(items);
  };

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
                              <Typography variant="body1" style={{fontWeight: 'bold'}}>
                                Favorite coin
                              </Typography>
                              <ListItem
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
                                <DraggableBalanceCard balanceDetail={coin} index={index} />
                              </ListItem>
                            </>
                          ) : (
                            <>
                              <ListItem
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
                                <DraggableBalanceCard balanceDetail={coin} index={index} />
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
            Cancel
          </Button>
          <Button variant={ButtonVariant.CONTAINED}>Apply Changes</Button>
        </div>
      </div>
    </>
  );
};
