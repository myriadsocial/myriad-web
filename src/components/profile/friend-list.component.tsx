import React, { useEffect, useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { useFriendsHook } from '../../hooks/use-friends-hook';

import ShowIf from 'src/components/common/show-if.component';
import { useFriends } from 'src/context/friends.context';
import { acronym } from 'src/helpers/string';
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
      // marginLeft: theme.spacing(-2),
      // marginRight: theme.spacing(-2)
    },
    item: {
      marginBottom: theme.spacing(0.5),
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      '& .MuiListItemText-root': {
        alignSelf: 'center'
      }
    },
    avatar: {
      width: 56,
      height: 56,
      marginRight: 16,
      background: '#424242'
    }
  })
);

const ITEM_HEIGHT = 48;

const FriendsList = ({ user }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const style = useStyles();

  const { state } = useFriends();
  const { loadFriends } = useFriendsHook(user);

  useEffect(() => {
    loadFriends();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className={style.root}>
      <div>
        <div className={style.content}>
          <ShowIf condition={state.friends.length === 0}>
            <Typography
              variant="h4"
              color="textPrimary"
              style={{ fontWeight: 500, fontSize: 14, textAlign: 'center', padding: '16px 0', color: '#B1AEB7' }}>
              You don't have any Myriad friend, try to search for people or tell your friends about myriad
            </Typography>
          </ShowIf>

          <List className={style.list}>
            {state.friends.map(request => {
              return (
                <>
                  <ListItem key={request.id} className={style.item} alignItems="center">
                    <ListItemAvatar>
                      <Avatar className={style.avatar} alt={request.requestor.name} src={request.requestor.profilePictureURL || ''}>
                        {acronym(request.requestor.name || '')}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText>
                      <Typography component="span" variant="h4" color="textPrimary" style={{ fontSize: 16 }}>
                        {request.requestor.name}
                      </Typography>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                          style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch'
                          }
                        }}>
                        <MenuItem onClick={handleClose}>Visit Profile</MenuItem>
                        <MenuItem onClick={handleClose}>Add to Favorite</MenuItem>
                        <MenuItem onClick={handleClose}>Remove Friend</MenuItem>
                      </Menu>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </>
              );
            })}
          </List>
        </div>
      </div>
    </Box>
  );
};

export default FriendsList;
