import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import Link from 'next/link';

import Avatar from '@material-ui/core/Avatar';
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

import clsx from 'clsx';
import {ToggleCollapseButton} from 'src/components/common/collapse-button.component';
import ShowIf from 'src/components/common/show-if.component';
import {useToggle} from 'src/hooks/use-toggle.hook';
import {RootState} from 'src/reducers';
import {FriendState} from 'src/reducers/friend/reducer';
import {UserState} from 'src/reducers/user/reducer';

type FriendsListProps = {
  showOnlineStatus?: boolean;
  expand?: boolean;
  onExpand?: () => void;
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

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [expanded, toggleExpand] = useToggle(true);
  const {friends, totalFriend, hasMore} = useSelector<RootState, FriendState>(
    state => state.friendState,
  );

  useEffect(() => {
    if (!expand || (!expanded && expand)) {
      toggleExpand();
    }
  }, [expand]);

  const handleExpand = () => {
    toggleExpand();
    onExpand && onExpand();
  };

  if (!user) return null;

  return (
    <Box
      className={clsx(style.root, {
        [`${style.expanded} ${style.root}`]: expanded,
      })}>
      <ListHeaderComponent title={`Friends (${totalFriend})`}>
        <ToggleCollapseButton defaultExpanded={expanded} onClick={handleExpand} />
      </ListHeaderComponent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div className={style.content}>
          <ShowIf condition={friends.length === 0}>
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
            {friends.map(request => {
              return (
                <>
                  {user.id !== request.requestorId && (
                    <ListItem key={request.id} className={style.item} alignItems="flex-start">
                      <Link href={`/${request.requestor.id}`}>
                        <a href={`/${request.requestor.id}`}>
                          <ListItemAvatar>
                            <Avatar
                              alt={request.requestor.name}
                              src={request.requestor.profile_picture?.sizes.thumbnail}
                            />
                          </ListItemAvatar>
                        </a>
                      </Link>
                      <ListItemText>
                        <Link href={`/${request.requestor.id}`}>
                          <a href={`/${request.requestor.id}`}>
                            <Typography component="span" variant="h4" color="textPrimary">
                              {request.requestor.name}
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
                  )}

                  {user.id !== request.friendId && (
                    <ListItem key={request.id} className={style.item} alignItems="flex-start">
                      <Link href={`/${request.friend.id}`}>
                        <a href={`/${request.friend.id}`}>
                          <ListItemAvatar>
                            <Avatar
                              alt={request.friend.name}
                              src={request.friend.profile_picture?.sizes.thumbnail}
                            />
                          </ListItemAvatar>
                        </a>
                      </Link>
                      <ListItemText>
                        <Link href={`/${request.friend.id}`}>
                          <a href={`/${request.friend.id}`}>
                            <Typography component="span" variant="h4" color="textPrimary">
                              {request.friend.name}
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
                  )}
                </>
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
