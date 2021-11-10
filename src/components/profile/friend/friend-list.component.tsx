import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import Link from 'next/link';

import {SvgIcon} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';

import {AvatarComponent} from 'src/components/common/Avatar.component';
import DialogTitle from 'src/components/common/DialogTitle.component';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import RemoveUser from 'src/images/user-minus.svg';
import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type FriendListProps = {
  profile: User;
  friends: Friend[];
  removeFriendRequest: (requestor: Friend) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: '8px 0',
    },
    header: {
      marginBottom: theme.spacing(2),
      display: 'flex',
    },
    content: {
      '&:last-child': {
        paddingBottom: 0,
      },
    },
    noContent: {
      fontWeight: 500,
      fontSize: 14,
      textAlign: 'center',
      padding: '16px 0',
      color: '#B1AEB7',
    },
    list: {
      // marginLeft: theme.spacing(-2),
      // marginRight: theme.spacing(-2)
    },
    item: {
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      '& .MuiListItemText-root': {
        alignSelf: 'center',
      },
    },
    avatar: {
      width: 56,
      height: 56,
      marginRight: 16,
      background: '#424242',
    },
    danger: {
      color: '#F83D3D',
      marginBottom: 0,
      '&:hover': {
        background: 'none',
      },
    },
    dialogRoot: {
      width: '413px',
      textAlign: 'center',
    },
    icon: {
      fontSize: 80,
    },
    subtitle1: {
      fontSize: 18,
      fontWeight: 700,
    },
    subtitle2: {
      fontSize: 16,
      fontWeight: 400,
    },
    alertMessage: {
      color: '#4B4851',
      width: 236,
    },
    'm-vertical1': {
      marginBottom: 16,
      marginTop: 16,
    },
    'm-vertical2': {
      marginBottom: 24,
      marginTop: 24,
    },
    center: {
      marginRight: 'auto',
      marginLeft: 'auto',
    },
    'flex-center': {
      display: 'flex',
      justifyContent: 'space-evenly',
    },
  }),
);

const FriendsListComponent: React.FC<FriendListProps> = ({
  profile,
  friends,
  removeFriendRequest,
}) => {
  const style = useStyles();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openModal, setOpenModal] = useState(false);
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [selectedFriendName, setSelectedFriendName] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    id: string,
    name: string,
    request: Friend,
  ) => {
    setAnchorEl(event.currentTarget);

    setSelectedProfileId(id);
    setSelectedFriendName(name);
    setSelectedFriend(request);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleRemoveAlert = () => {
    setOpenModal(!openModal);
  };

  const handleUnFriendRequest = (friend: Friend | null) => {
    if (friend) removeFriendRequest(friend);
    toggleRemoveAlert();
    handleClose();
  };

  if (!user) return null;

  return (
    <Box className={style.root}>
      <div>
        <div className={style.content}>
          <ShowIf condition={!friends.length}>
            {user?.id === profile.id ? (
              <Typography variant="h4" color="textPrimary" className={style.noContent}>
                You don&apos;t have any Myriad friends yet. Search for people or tell your friends
                about Myriad!
              </Typography>
            ) : (
              <Typography variant="h4" color="textPrimary" className={style.noContent}>
                {profile.name} doesn&apos;t have any Myriad friends yet.
              </Typography>
            )}
          </ShowIf>

          <List className={style.list}>
            {friends.map(request => {
              return (
                <>
                  {profile.id !== request.requesteeId && (
                    <ListItem
                      key={request.id}
                      className={style.item}
                      alignItems="center"
                      divider={true}>
                      <ListItemAvatar>
                        <AvatarComponent
                          className={style.avatar}
                          alt={request.requestee.name}
                          src={request.requestee.profilePictureURL || ''}>
                          {acronym(request.requestee.name || '')}
                        </AvatarComponent>
                      </ListItemAvatar>
                      <ListItemText>
                        <Link href={`/${request.requesteeId}`}>
                          <a href={`/${request.requesteeId}`}>
                            <Typography component="span" variant="h4" color="textPrimary">
                              {request.requestee.name}
                            </Typography>
                          </a>
                        </Link>
                      </ListItemText>
                      <ListItemSecondaryAction>
                        {profile.id == user.id && (
                          <IconButton
                            edge="end"
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={event =>
                              handleClick(
                                event,
                                request.requesteeId,
                                request.requestee.name,
                                request,
                              )
                            }>
                            <MoreVertIcon />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  )}
                  {profile.id !== request.requestorId && (
                    <ListItem
                      key={request.id}
                      className={style.item}
                      alignItems="center"
                      divider={true}>
                      <ListItemAvatar>
                        <AvatarComponent
                          className={style.avatar}
                          alt={request.requestor.name}
                          src={request.requestor.profilePictureURL || ''}>
                          {acronym(request.requestor.name || '')}
                        </AvatarComponent>
                      </ListItemAvatar>
                      <ListItemText>
                        <Link href={`/${request.requestorId}`}>
                          <a href={`/${request.requestorId}`}>
                            <Typography component="span" variant="h4" color="textPrimary">
                              {request.requestor.name}
                            </Typography>
                          </a>
                        </Link>
                      </ListItemText>
                      <ListItemSecondaryAction>
                        {profile.id == user.id && (
                          <IconButton
                            edge="end"
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={event =>
                              handleClick(
                                event,
                                request.requestorId,
                                request.requestor.name,
                                request,
                              )
                            }>
                            <MoreVertIcon />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  )}
                </>
              );
            })}
          </List>
          <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
            <Link href={`/${selectedProfileId}`}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a>
                <MenuItem>Visit Profile</MenuItem>
              </a>
            </Link>
            <MenuItem onClick={handleClose} divider={true} disabled={true}>
              Add to Favorite
            </MenuItem>
            <MenuItem onClick={toggleRemoveAlert}>
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

          <Dialog open={openModal} aria-labelledby="no-extension-installed">
            <DialogTitle id="name" onClose={toggleRemoveAlert}>
              Remove Friend
            </DialogTitle>
            <DialogContent>
              <div className={style.dialogRoot}>
                <SvgIcon className={style.icon} fontSize="inherit" color="error">
                  <WarningRoundedIcon />
                </SvgIcon>
                <Typography className={style.subtitle1} variant="h2" color="error">
                  Unfriend {selectedFriendName}
                </Typography>
                <Typography
                  className={`${style.subtitle2} ${style.alertMessage}  ${style.center} ${style['m-vertical2']}`}>
                  Are you sure want to remove this person from your friend list? You will{' '}
                  <Typography variant="inherit" color="error">
                    no longer see posts
                  </Typography>{' '}
                  from this person.
                </Typography>
                <div className={`${style['flex-center']} ${style['m-vertical1']}`}>
                  <Button variant="text" onClick={toggleRemoveAlert}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUnFriendRequest(selectedFriend)}>
                    Remove
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Box>
  );
};

export default FriendsListComponent;
