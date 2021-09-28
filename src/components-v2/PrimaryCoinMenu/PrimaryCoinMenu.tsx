import React, {useState} from 'react';
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useStyles} from '.';
import FullVectorIcon from '../../images/Icons/FullVectorIcon.svg';
import TripleDoubleDotsIcon from '../../images/Icons/TripleDoubleDotsIcon.svg';
import {BalanceDetail} from '../MyWallet/';
import {CustomAvatar, CustomAvatarSize} from '../atoms/Avatar';
import {Button, ButtonVariant, ButtonColor} from '../atoms/Button';

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

type PrimaryCoinMenuProps = {
  togglePrimaryCoinMenu: () => void;
  balanceDetails: BalanceDetail[];
};

export const PrimaryCoinMenu: React.FC<PrimaryCoinMenuProps> = props => {
  const {togglePrimaryCoinMenu, balanceDetails} = props;
  const classes = useStyles();

  const [coins, updateCoins] = useState(balanceDetails);

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
