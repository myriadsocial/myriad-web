import React from 'react';
import {useSelector} from 'react-redux';

import Link from 'next/link';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import LinkComponent from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

import clsx from 'clsx';
import {AvatarComponent} from 'src/components/common/Avatar.component';
import {ToggleCollapseButton} from 'src/components/common/collapse-button.component';
import ShowIf from 'src/components/common/show-if.component';
import {useFriendHook} from 'src/components/profile/use-profile-friend.hook';
import {acronym} from 'src/helpers/string';
import {Friend, FriendStatus} from 'src/interfaces/friend';
import {RootState} from 'src/reducers';
import {FriendRequestState} from 'src/reducers/friend-request/reducer';

type FriendRequestsProps = {
  expand: boolean;
  showAll: boolean;
  toggleRequest: (requestor: Friend, status: FriendStatus) => void;
  onShowAll: () => void;
  onExpand: () => void;
  showMore: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: '8px 0',
    },
    expanded: {
      flexGrow: 1,
    },
    header: {
      marginBottom: theme.spacing(1),
      display: 'flex',
    },
    content: {
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
      maxHeight: 420,
    },
    item: {
      marginBottom: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),

      '& .MuiTypography-root': {
        fontSize: 16,
        fontWeight: 400,
      },
    },
    action: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      position: 'relative',
      right: 'unset',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      '&& > .MuiButton-root': {
        marginLeft: theme.spacing(2),
        '&:first-child': {
          marginLeft: 0,
        },
      },
    },
    more: {
      display: 'block',
      fontSize: 14,
      margin: '0 auto',
      marginBottom: 8,
    },
  }),
);

const FriendRequests: React.FC<FriendRequestsProps> = ({
  expand,
  showAll,
  toggleRequest,
  onShowAll,
  onExpand,
  showMore,
}) => {
  const style = useStyles();

  const {
    requests,
    hasMore,
    meta: {totalItemCount: totalRequest},
  } = useSelector<RootState, FriendRequestState>(state => state.friendRequestState);
  const {removeFriendRequest} = useFriendHook();
  const limit = 2;

  const approveFriendRequest = (friend: Friend) => {
    toggleRequest(friend, FriendStatus.APPROVED);
  };

  const rejectFriendRequest = (friend: Friend) => {
    removeFriendRequest(friend);
  };

  const handleToggleExpand = () => {
    onExpand();
  };

  const handleShowMore = () => {
    if (!showAll) {
      onShowAll();
    }

    if (showAll && hasMore) {
      showMore();
    }
  };

  return (
    <Box
      className={clsx(style.root, {
        [`${style.expanded} ${style.root}`]: showAll,
      })}>
      <div className={style.header}>
        <Typography
          variant="caption"
          component="div"
          style={{fontWeight: 700, fontSize: 16, lineHeight: '36px'}}>
          Friend Requests ({totalRequest})
        </Typography>

        <ToggleCollapseButton defaultExpanded={expand} onClick={handleToggleExpand} />
      </div>
      <div className={style.content}>
        <Collapse in={expand} timeout="auto" unmountOnExit>
          <ShowIf condition={requests.length === 0}>
            <Typography
              variant="h4"
              color="textPrimary"
              style={{
                fontWeight: 500,
                textAlign: 'center',
                fontSize: 14,
                color: '#B1AEB7',
                padding: '16px 0',
              }}>
              You don&apos;t have any friend requests
            </Typography>
          </ShowIf>

          <List className={style.list}>
            {requests.slice(0, showAll ? requests.length : limit).map(request => {
              return (
                <ListItem key={request.id} className={style.item} alignItems="flex-start">
                  <Link href={`/${request.requestor.id}`}>
                    <a href={`/${request.requestor.id}`}>
                      <ListItemAvatar>
                        <AvatarComponent
                          alt={request.requestor.name}
                          src={request.requestor.profilePictureURL}>
                          {acronym(request.requestor.name)}
                        </AvatarComponent>
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
                    <div className={style.action}>
                      <Button
                        onClick={() => rejectFriendRequest(request)}
                        aria-label="tip-post-user"
                        color="default"
                        variant="contained"
                        size="medium">
                        Ignore
                      </Button>
                      <Button
                        onClick={() => approveFriendRequest(request)}
                        aria-label="tip-post-user"
                        color="primary"
                        variant="contained"
                        size="medium">
                        Accept
                      </Button>
                    </div>
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>

          {(!showAll || hasMore) && requests.length > 0 && (
            <LinkComponent
              className={style.more}
              component="button"
              color="textPrimary"
              onClick={handleShowMore}>
              (show more)
            </LinkComponent>
          )}
        </Collapse>
      </div>
    </Box>
  );
};

export default FriendRequests;
