import React from 'react';
import {useSelector} from 'react-redux';

import Link from 'next/link';

import Avatar from '@material-ui/core/Avatar';
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
import {ToggleCollapseButton} from 'src/components/common/collapse-button.component';
import ShowIf from 'src/components/common/show-if.component';
import {useToggle} from 'src/hooks/use-toggle.hook';
import {ExtendedFriend, FriendStatus} from 'src/interfaces/friend';
import {RootState} from 'src/reducers';
import {FriendState} from 'src/reducers/friend/reducer';

type FriendRequestsProps = {
  toggleRequest: (requestor: ExtendedFriend, status: FriendStatus) => void;
  onShowAll?: () => void;
  onMinimize?: () => void;
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

const FriendRequests: React.FC<FriendRequestsProps> = ({toggleRequest, onShowAll, onMinimize}) => {
  const style = useStyles();

  const {requests, totalRequest} = useSelector<RootState, FriendState>(state => state.friendState);
  const [expanded, toggleExpand] = useToggle(true);
  const [showAll, toggleShowAll] = useToggle(false);

  const approveFriendRequest = (friend: ExtendedFriend) => {
    toggleRequest(friend, FriendStatus.APPROVED);
  };

  const rejectFriendRequest = (friend: ExtendedFriend) => {
    toggleRequest(friend, FriendStatus.REJECTED);
  };

  const handleToggleExpand = () => {
    if (showAll && onMinimize) {
      onMinimize();
      toggleShowAll();
    }

    toggleExpand();
  };

  const handleShowAll = () => {
    toggleShowAll();
    onShowAll && onShowAll();
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

        <ToggleCollapseButton defaultExpanded={expanded} onClick={handleToggleExpand} />
      </div>
      <div className={style.content}>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
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
            {requests.slice(0, showAll ? totalRequest : 2).map(request => {
              return (
                <ListItem key={request.id} className={style.item} alignItems="flex-start">
                  <Link href={`/${request.requestor.id}`}>
                    <a href={`/${request.requestor.id}`}>
                      <ListItemAvatar>
                        <Avatar
                          alt={request.requestor.name}
                          src={request.requestor.profilePictureURL}
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

          <ShowIf condition={totalRequest > requests.length}>
            <LinkComponent
              className={style.more}
              component="button"
              color="textPrimary"
              onClick={handleShowAll}>
              (show {showAll ? 'less' : 'all'} request)
            </LinkComponent>
          </ShowIf>
        </Collapse>
      </div>
    </Box>
  );
};

export default FriendRequests;
