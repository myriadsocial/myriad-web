import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { SvgIcon } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
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
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';

import { useFriendsHook } from '../../hooks/use-friends-hook';

import DialogTitle from 'src/components/common/DialogTitle.component';
import ShowIf from 'src/components/common/show-if.component';
import { useFriends } from 'src/context/friends.context';
import { acronym } from 'src/helpers/string';
import RemoveUser from 'src/images/user-minus.svg';
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
    noContent: {
      fontWeight: 500,
      fontSize: 14,
      textAlign: 'center',
      padding: '16px 0',
      color: '#B1AEB7'
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
    },
    danger: {
      color: '#F83D3D',
      marginBottom: 0,
      '&:hover': {
        background: 'none'
      }
    },
    dialogRoot: {
      width: '413px',
      textAlign: 'center'
    },
    icon: {
      fontSize: 80
    },
    subtitle1: {
      fontSize: 18,
      fontWeight: 700
    },
    subtitle2: {
      fontSize: 16,
      fontWeight: 400
    },
    alertMessage: {
      color: '#4B4851',
      width: 236
    },
    'm-vertical1': {
      marginBottom: 16,
      marginTop: 16
    },
    'm-vertical2': {
      marginBottom: 24,
      marginTop: 24
    },
    center: {
      marginRight: 'auto',
      marginLeft: 'auto'
    },
    'flex-center': {
      display: 'flex',
      justifyContent: 'space-evenly'
    }
  })
);

const FriendsList = ({ user }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  // alert remove friend
  const [openModal, setOpenModal] = useState(false);

  const style = useStyles();
  const router = useRouter();

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

  const visitProfile = (id: string) => {
    router.push(`/${id}`);
    console.log(id, '<<<');
  };

  const toggleProfileForm = () => {
    setOpenModal(!openModal);
  };

  return (
    <Box className={style.root}>
      <div>
        <div className={style.content}>
          <ShowIf condition={state.friends.length === 0}>
            <Typography variant="h4" color="textPrimary" className={style.noContent}>
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
                      <Typography component="span" variant="h4" color="textPrimary">
                        {request.requestor.name}
                      </Typography>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
                        <MenuItem onClick={() => visitProfile(request.requestorId)}>Visit Profile</MenuItem>
                        <MenuItem onClick={handleClose}>Add to Favorite</MenuItem>
                        <Divider />
                        <MenuItem onClick={toggleProfileForm}>
                          <Button
                            className={style.danger}
                            disableRipple={true}
                            disableFocusRipple={true}
                            variant="text"
                            color="default"
                            size="medium"
                            startIcon={<RemoveUser />}>
                            Remove Friend
                          </Button>
                        </MenuItem>
                      </Menu>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />

                  <Dialog open={openModal} aria-labelledby="no-extension-installed">
                    <DialogTitle id="name" onClose={toggleProfileForm}>
                      Remove Friend
                    </DialogTitle>
                    <DialogContent>
                      <div className={style.dialogRoot}>
                        <SvgIcon className={style.icon} fontSize="inherit" color="error">
                          <WarningRoundedIcon />
                        </SvgIcon>
                        <Typography className={style.subtitle1} variant="h2" color="error">
                          Unfriend {request.requestor.name}
                        </Typography>
                        <Typography className={`${style.subtitle2} ${style.alertMessage}  ${style.center} ${style['m-vertical2']}`}>
                          Are you sure want to remove this person from your friend list? You will{' '}
                          <Typography variant="inherit" color="error">
                            no longer see posts
                          </Typography>{' '}
                          from this person.
                        </Typography>
                        <div className={`${style['flex-center']} ${style['m-vertical1']}`}>
                          <Button variant="text" onClick={toggleProfileForm}>
                            Cancel
                          </Button>
                          <Button variant="contained" color="primary" onClick={() => console.log('remove friend')}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
