import React from 'react';
import {useSelector} from 'react-redux';

import Link from 'next/link';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import {ListHeaderComponent} from './list-header.component';
import {useFriendList} from './use-friend-list.hook';

import clsx from 'clsx';
import {AvatarComponent} from 'src/components/common/Avatar.component';
import {ToggleCollapseButton} from 'src/components/common/collapse-button.component';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import {RootState} from 'src/reducers';
import {FriendState} from 'src/reducers/friend/reducer';

type FriendsListProps = {
  showOnlineStatus?: boolean;
  expand?: boolean;
  onExpand: (closeOthers: boolean) => void;
  showMore: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: '8px 0',
      display: 'flex',
      flexFlow: 'column',
    },
    expanded: {
      flexGrow: 1,
    },
    header: {
      marginBottom: theme.spacing(1),
      display: 'flex',
    },
    content: {
      flexGrow: 1,
      '&:last-child': {
        paddingBottom: 0,
      },
    },
    list: {
      marginTop: 0,
      marginBottom: 0,
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(-2),
      overflow: 'auto',
      height: 320,
    },
    item: {
      marginBottom: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      '& .MuiListItemText-root': {
        alignSelf: 'center',
      },
      '& .MuiTypography-root': {
        fontSize: 16,
        fontWeight: 400,
      },
    },
    online: {
      color: '#06960C',
    },
    action: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

const FriendsListComponent: React.FC<FriendsListProps> = ({
  showOnlineStatus = false,
  expand = true,
  showMore,
  onExpand,
}) => {
  const style = useStyles();

  const {
    hasMore,
    meta: {totalItemCount: totalFriend},
  } = useSelector<RootState, FriendState>(state => state.friendState);
  const friendList = useFriendList();

  const handleExpand = () => {
    onExpand(hasMore);
  };

  return (
    <Box
      className={clsx(style.root, {
        [`${style.expanded} ${style.root}`]: expand,
      })}>
      <ListHeaderComponent title={`Friends (${totalFriend})`}>
        <ToggleCollapseButton defaultExpanded={expand} onClick={handleExpand} />
      </ListHeaderComponent>

      <Collapse in={expand} timeout="auto" unmountOnExit>
        <div className={style.content}>
          <ShowIf condition={friendList.length === 0}>
            <Typography
              variant="h4"
              color="textPrimary"
              style={{
                fontWeight: 500,
                fontSize: 14,
                textAlign: 'center',
                padding: '16px 0',
                color: '#B1AEB7',
              }}>
              You don&apos;t have any Myriad friends yet. Search for people or tell your friends
              about Myriad!
            </Typography>
          </ShowIf>

          <List className={style.list}>
            {friendList.map(friend => {
              return (
                <ListItem key={friend.id} className={style.item} alignItems="flex-start">
                  <Link href={`/${friend.id}`}>
                    <a href={`/${friend.id}`}>
                      <ListItemAvatar>
                        <AvatarComponent alt={friend.name} src={friend.avatar}>
                          {acronym(friend.name)}
                        </AvatarComponent>
                      </ListItemAvatar>
                    </a>
                  </Link>
                  <ListItemText>
                    <Link href={`/${friend.id}`}>
                      <a href={`/${friend.id}`}>
                        <Typography component="span" variant="h4" color="textPrimary">
                          {friend.name}
                        </Typography>
                      </a>
                    </Link>
                  </ListItemText>
                  {showOnlineStatus && (
                    <ListItemSecondaryAction>
                      <FiberManualRecordIcon className={style.online} />
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              );
            })}
          </List>

          {hasMore && (
            <div className={style.action}>
              <Button onClick={showMore} variant="outlined">
                Show More
              </Button>
            </div>
          )}
        </div>
      </Collapse>
    </Box>
  );
};

export default FriendsListComponent;
