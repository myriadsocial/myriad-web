import React, { useEffect, useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import { useFriendsHook } from '../../hooks/use-friends-hook';
import { ListHeaderComponent } from './list-header.component';
import { ListSubHeaderComponent } from './list-sub-header.component';

import { ToggleCollapseButton } from 'src/components/common/collapse-button.component';
import ShowIf from 'src/components/common/show-if.component';
import { useFriends } from 'src/context/friends.context';
import { User } from 'src/interfaces/user';

type Props = {
  user: User;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: '8px 0'
    },
    header: {
      marginBottom: theme.spacing(2),
      display: 'flex'
    },
    content: {
      '&:last-child': {
        paddingBottom: 0
      }
    },
    list: {
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(-2)
    },
    item: {
      marginBottom: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      '& .MuiListItemText-root': {
        alignSelf: 'center'
      }
    }
  })
);

const Friends = ({ user }: Props) => {
  const style = useStyles();

  const { state } = useFriends();
  const { loadFriends } = useFriendsHook(user);
  const [openOnlineFriends, setOpenOnlineFriends] = useState(true);
  const [openOtherFriends] = useState(false);

  useEffect(() => {
    loadFriends();
  }, []);

  const toggleOnlineFriends = () => {
    setOpenOnlineFriends(!openOnlineFriends);
  };

  console.log('openOnlineFriends', openOnlineFriends);
  return (
    <Box className={style.root}>
      <ListHeaderComponent title={`Friends (${state.friends.length})`} />

      <div>
        <div className={style.header}>
          <ListSubHeaderComponent title={`Online (${state.friends.length})`} />
          {state.friends.length > 0 && <ToggleCollapseButton onClick={toggleOnlineFriends} />}
        </div>
        <Collapse in={openOnlineFriends} timeout="auto" unmountOnExit>
          <div className={style.content}>
            <ShowIf condition={state.friends.length === 0}>
              <Typography variant="h4" color="textPrimary" style={{ textAlign: 'center', padding: '16px 0' }}>
                No Friends
              </Typography>
            </ShowIf>

            <List className={style.list}>
              {state.friends.map(request => {
                return (
                  <ListItem key={request.id} className={style.item} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={request.requestor.name} src={request.requestor.profilePictureURL} />
                    </ListItemAvatar>
                    <ListItemText>
                      <Typography component="span" variant="h4" color="textPrimary" style={{ fontSize: 16 }}>
                        {request.requestor.name}
                      </Typography>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <FiberManualRecordIcon style={{ color: '#06960C' }} />
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </div>
        </Collapse>
      </div>

      <div>
        <div className={style.header}>
          <ListSubHeaderComponent title={`Others (0)`} />
          {openOtherFriends && <ToggleCollapseButton onClick={console.log} />}
        </div>
      </div>
    </Box>
  );
};

export default Friends;
