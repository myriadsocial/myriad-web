import {DotsHorizontalIcon} from '@heroicons/react/outline';

import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useSelector, useDispatch} from 'react-redux';

import Link from 'next/link';
import {useRouter} from 'next/router';

import {IconButton, Menu, MenuItem, Button, Grid} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {DropdownMenu} from '../atoms/DropdownMenu';
import {PromptComponent} from '../atoms/Prompt/prompt.component';
import SearchComponent from '../atoms/Search/SearchBox';
import {friendFilterOptions, FriendType, sortOptions} from './default';
import {useStyles} from './friend.style';
import {FriendDetail, useFriendList} from './hooks/use-friend-list.hook';

import {SendTipContainer} from 'src/components/SendTip';
import {Empty} from 'src/components/atoms/Empty';
import {Loading} from 'src/components/atoms/Loading';
import {Modal} from 'src/components/atoms/Modal';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {blockFromFriend, removeFromFriend} from 'src/reducers/friend/actions';
import {UserState} from 'src/reducers/user/reducer';
import {setIsTipSent} from 'src/reducers/wallet/actions';
import {setTippedUserId, setTippedUser as setDetailTippedUser} from 'src/reducers/wallet/actions';
import {WalletState} from 'src/reducers/wallet/reducer';

export type FriendListProps = {
  type?: 'contained' | 'basic';
  user?: User;
  background?: boolean;
  disableFilter?: boolean;
  disableSort?: boolean;
  friends: Friend[];
  hasMore: boolean;
  onSearch: (query: string) => void;
  onFilter: (type: FriendType) => void;
  onSort: (type: string) => void;
  onLoadNextPage: () => void;
};

export const FriendListComponent: React.FC<FriendListProps> = props => {
  const {
    type,
    friends,
    user,
    hasMore,
    background = false,
    disableFilter = false,
    disableSort = false,
    onSearch,
    onFilter,
    onSort,
    onLoadNextPage,
  } = props;
  const style = useStyles({type});
  const router = useRouter();
  const dispatch = useDispatch();

  const {openToasterSnack} = useToasterSnackHook();
  const {friendList, removeFromFriendList} = useFriendList(friends, user);

  const {user: currentUser} = useSelector<RootState, UserState>(state => state.userState);

  const {isTipSent, explorerURL} = useSelector<RootState, WalletState>(state => state.walletState);
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentFriend, setCurrentFriend] = useState<null | FriendDetail>(null);
  const [tippedFriendForHistory, setTippedFriendForHistory] = useState<FriendDetail | null>(null);
  const [isSendTipOpened, setSendTipOpened] = useState(false);
  const [isRemoveFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false);
  const [isConfirmBlockUserDialogOpen, setConfirmBlockUserDialogOpen] = useState(false);
  const [isTipSuccessDialogOpen, setTipSuccessDialogOpen] = useState(false);

  useEffect(() => {
    if (isTipSent) {
      closeSendTip();
    }
  }, [isTipSent]);

  const handleOpenFriendSetting =
    (currentFriend: FriendDetail) => (event: React.MouseEvent<HTMLButtonElement>) => {
      setCurrentFriend(currentFriend);
      setAnchorEl(event.currentTarget);
    };

  const handleCloseFriendSetting = () => {
    setAnchorEl(null);
  };

  const closeConfirmBlockUserDialog = () => {
    setConfirmBlockUserDialogOpen(false);
  };

  const closeConfirmRemoveFriendDialog = () => {
    setRemoveFriendDialogOpen(false);
  };

  const closeTipSuccessDialog = (): void => {
    setTipSuccessDialogOpen(false);
  };

  const handleVisitProfile = () => {
    if (!currentFriend) {
      router.push('/404');
    } else {
      router.push(`/profile/${currentFriend.id}`, undefined, {shallow: false});
    }

    handleCloseFriendSetting();
  };

  const handleSendTip = () => {
    if (currentFriend) {
      dispatch(setDetailTippedUser(currentFriend.name, currentFriend.avatar ?? ''));
      dispatch(setTippedUserId(currentFriend.id));

      setSendTipOpened(true);
      handleCloseFriendSetting();
    }
  };

  const closeSendTip = () => {
    if (isTipSent && currentFriend) {
      setSendTipOpened(false);
      setTippedFriendForHistory(currentFriend);
      setTipSuccessDialogOpen(true);
    } else {
      console.log('no user tipped');
    }

    dispatch(setIsTipSent(false));

    setSendTipOpened(false);
    setCurrentFriend(null);
  };

  const handleUnfriend = () => {
    if (!currentFriend) {
      router.push('/404');
    } else {
      setRemoveFriendDialogOpen(true);
    }

    handleCloseFriendSetting();
  };

  const handleBlock = () => {
    if (!currentFriend) {
      router.push('/404');
    } else {
      setConfirmBlockUserDialogOpen(true);
    }

    handleCloseFriendSetting();
  };

  const handleFilterSelected = (selected: string) => {
    onFilter(selected as FriendType);
  };

  const handleRemoveFriend = () => {
    if (!currentFriend) {
      router.push('/404');
    } else {
      const removedFriend = friends.find(friend => {
        return friend.requesteeId === currentFriend.id || friend.requestorId === currentFriend.id;
      });

      if (!removedFriend) return;

      dispatch(removeFromFriend(removedFriend));

      removeFromFriendList(currentFriend.id);
      closeConfirmRemoveFriendDialog();
      openToasterSnack({
        message: `${currentFriend?.name} has been removed from your friend lists`,
        variant: 'success',
      });

      setCurrentFriend(null);
    }
  };

  const handleBlockUser = () => {
    if (!currentFriend) {
      router.push('/404');
    } else {
      dispatch(blockFromFriend(currentFriend.id));

      removeFromFriendList(currentFriend.id);
      closeConfirmBlockUserDialog();
      openToasterSnack({
        message: 'User successfully blocked',
        variant: 'success',
      });

      setCurrentFriend(null);
    }
  };

  if (friends.length === 0) {
    return (
      <Empty title="Friend list is empty" subtitle="Find or invite your friends to Myriad 😉" />
    );
  }

  return (
    <div>
      <ShowIf condition={!disableFilter || !disableSort}>
        <Grid
          container
          justifyContent={disableFilter ? 'flex-end' : 'space-between'}
          alignItems="center">
          <ShowIf condition={!disableFilter}>
            <DropdownMenu
              title="Filter by"
              options={friendFilterOptions}
              onChange={handleFilterSelected}
            />
          </ShowIf>
          <ShowIf condition={!disableSort}>
            <DropdownMenu title={'Sort by'} options={sortOptions} onChange={onSort} />
          </ShowIf>
        </Grid>
      </ShowIf>

      <div className={style.root}>
        <div className={style.search}>
          <SearchComponent onSubmit={onSearch} placeholder={'Search friend'} reverse />
        </div>
        <List>
          <InfiniteScroll
            scrollableTarget="scrollable-timeline"
            dataLength={friendList.length}
            hasMore={hasMore}
            next={onLoadNextPage}
            loader={<Loading />}>
            {friendList.map(friend => (
              <ListItem
                key={friend.id}
                classes={{root: background ? style.backgroundEven : ''}}
                className={style.option}
                alignItems="center">
                <ListItemAvatar>
                  <Link href={'/profile/[id]'} as={`/profile/${friend.id}`} passHref>
                    <Avatar className={style.avatar} alt={'name'} src={friend.avatar}>
                      {acronym(friend.name)}
                    </Avatar>
                  </Link>
                </ListItemAvatar>
                <ListItemText>
                  <Link href={'/profile/[id]'} as={`/profile/${friend.id}`} passHref>
                    <Typography className={style.name} component="span" color="textPrimary">
                      {friend.name}
                    </Typography>
                  </Link>
                  <ShowIf condition={!!friend.totalMutual}>
                    <Typography className={style.friend} component="p" color="textSecondary">
                      {friend.totalMutual} mutual friends
                    </Typography>
                  </ShowIf>
                </ListItemText>

                <div className="hidden-button">
                  <IconButton
                    aria-label="friend-setting"
                    classes={{root: style.iconbutton}}
                    color="primary"
                    onClick={handleOpenFriendSetting(friend)}
                    disableRipple={true}
                    disableFocusRipple={true}
                    disableTouchRipple>
                    <SvgIcon
                      component={DotsHorizontalIcon}
                      classes={{root: style.icon}}
                      fontSize="small"
                    />
                  </IconButton>
                </div>
              </ListItem>
            ))}
          </InfiniteScroll>
        </List>
      </div>

      <Modal
        gutter="none"
        open={isSendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Find this user insightful? Send a tip!">
        <SendTipContainer />
      </Modal>

      <Menu
        id={currentFriend?.id ?? 'friend-id'}
        anchorEl={anchorEl}
        style={{width: 170}}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseFriendSetting}>
        <MenuItem onClick={handleVisitProfile}>Visit profile</MenuItem>
        <MenuItem
          disabled={balanceDetails.length === 0 || currentFriend?.id === currentUser?.id}
          onClick={handleSendTip}>
          Send direct tip
        </MenuItem>
        <ShowIf
          condition={
            currentUser?.id === user?.id &&
            (!currentFriend || currentFriend.username !== 'myriad_official')
          }>
          <MenuItem className={style.danger} onClick={handleUnfriend}>
            Unfriend
          </MenuItem>

          <MenuItem className={style.danger} onClick={handleBlock}>
            Block this person
          </MenuItem>
        </ShowIf>
      </Menu>

      <PromptComponent
        onCancel={closeConfirmRemoveFriendDialog}
        open={isRemoveFriendDialogOpen}
        icon="danger"
        title={`Unfriend ${currentFriend ? currentFriend.name : 'Unknown'}?`}
        subtitle="You won't be shown their posts in your timeline anymore and you might not be able to see their complete profile. Are you sure?">
        <Grid container justifyContent="space-evenly">
          <Button
            onClick={closeConfirmRemoveFriendDialog}
            size="small"
            variant="outlined"
            color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleRemoveFriend}
            className={style.error}
            size="small"
            variant="contained">
            Unfriend Now
          </Button>
        </Grid>
      </PromptComponent>

      <PromptComponent
        onCancel={closeConfirmBlockUserDialog}
        open={isConfirmBlockUserDialogOpen}
        icon="danger"
        title="Block User?"
        subtitle="You won't be shown their posts in your timeline anymore and you might not be able to see their complete profile. Are you sure?">
        <Grid justifyContent="space-evenly">
          <Button
            onClick={closeConfirmBlockUserDialog}
            size="small"
            variant="outlined"
            color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleBlockUser}
            className={style.error}
            size="small"
            variant="contained">
            Block Now
          </Button>
        </Grid>
      </PromptComponent>

      <PromptComponent
        icon={'success'}
        open={isTipSuccessDialogOpen}
        onCancel={closeTipSuccessDialog}
        title={'Success'}
        subtitle={
          <Typography component="div">
            Tip to{' '}
            <Box fontWeight={400} display="inline">
              {tippedFriendForHistory?.name ?? 'Unknown Myrian'}
            </Box>{' '}
            sent successfully
          </Typography>
        }>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <a
            target="_blank"
            style={{textDecoration: 'none'}}
            href={explorerURL ?? 'https://myriad.social'}
            rel="noopener noreferrer">
            <Button style={{marginRight: '12px'}} size="small" variant="outlined" color="secondary">
              Transaction details
            </Button>
          </a>
          <Button size="small" variant="contained" color="primary" onClick={closeTipSuccessDialog}>
            Return
          </Button>
        </div>
      </PromptComponent>
    </div>
  );
};
