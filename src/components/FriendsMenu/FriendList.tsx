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
import {FilterDropdownMenu} from '../atoms/FilterDropdownMenu';
import {PromptComponent} from '../atoms/Prompt/prompt.component';
import SearchComponent from '../atoms/Search/SearchBox';
import {friendFilterOptions, FriendType, sortOptions} from './default';
import {FriendListProps} from './default';
import {useStyles} from './friend.style';
import {FriendDetail, useFriendList} from './hooks/use-friend-list.hook';

import {SendTipContainer} from 'src/components/SendTip';
import {Empty} from 'src/components/atoms/Empty';
import {Loading} from 'src/components/atoms/Loading';
import {Modal} from 'src/components/atoms/Modal';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {blockedFriendList, removedFriendList} from 'src/reducers/friend/actions';
import {setTippedUserId, setTippedUser as setDetailTippedUser} from 'src/reducers/wallet/actions';
import {WalletState} from 'src/reducers/wallet/reducer';

export const FriendListComponent: React.FC<FriendListProps> = props => {
  const {
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
  const style = useStyles();
  const router = useRouter();

  const {isTipSent} = useSelector<RootState, WalletState>(state => state.walletState);
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentFriend, setCurrentFriend] = useState<null | FriendDetail>(null);
  const [tippedFriendForHistory, setTippedFriendForHistory] = useState<FriendDetail | null>(null);
  const [sendTipOpened, setSendTipOpened] = useState(false);
  const [friendList, setFriendList] = useState<FriendDetail[]>([]);
  const [openRemoveFriend, setOpenRemoveFriend] = useState(false);
  const [openBlockUser, setOpenBlockUser] = useState(false);
  const [openSuccessPrompt, setOpenSuccessPrompt] = useState(false);

  const {openToasterSnack} = useToasterSnackHook();

  const dispatch = useDispatch();

  useEffect(() => {
    const list = useFriendList(friends, user);
    setFriendList(list);
  }, [friends[0], user]);

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
      setOpenSuccessPrompt(true);
    } else {
      console.log('no user tipped');
    }

    setSendTipOpened(false);
    setCurrentFriend(null);
  };

  const handleCloseSuccessPrompt = (): void => {
    setOpenSuccessPrompt(false);
  };

  const handleUnfriend = () => {
    if (!currentFriend) {
      router.push('/404');
    } else {
      setOpenRemoveFriend(true);
    }
    handleCloseFriendSetting();
  };

  const handleBlock = () => {
    if (!currentFriend) {
      router.push('/404');
    } else {
      setOpenBlockUser(true);
    }
    handleCloseFriendSetting();
  };

  const handleFilterSelected = (selected: string) => {
    onFilter(selected as FriendType);
  };

  const handleSearch = (query: string) => {
    onSearch(query);
  };

  const closeConfirmRemoveFriend = () => {
    setOpenRemoveFriend(false);
  };

  const handleRemoveFriend = () => {
    if (!currentFriend) {
      router.push('/404');
    } else {
      const removedFriend = friends.find(friend => {
        if (friend.requesteeId === currentFriend.id || friend.requestorId === currentFriend.id)
          return true;
        return false;
      });

      if (!removedFriend) return;

      dispatch(removedFriendList(removedFriend));

      const newFriendList = friendList.filter(friend => friend.id !== currentFriend.id);

      setFriendList(newFriendList);
      closeConfirmRemoveFriend();

      openToasterSnack({
        message: `${currentFriend?.name} has removed from your friend list`,
        variant: 'success',
      });

      setCurrentFriend(null);
    }
  };

  const closeConfirmBlockUser = () => {
    setOpenBlockUser(false);
  };

  const handleBlockUser = () => {
    if (!currentFriend) {
      router.push('/404');
    } else {
      const newFriendList = friendList.filter(friend => friend.id !== currentFriend.id);

      dispatch(blockedFriendList(currentFriend.id));

      setFriendList(newFriendList);
      closeConfirmBlockUser();

      openToasterSnack({
        message: 'User successfully blocked',
        variant: 'success',
      });

      setCurrentFriend(null);
    }
  };

  const handleSortChanged = (sort: string) => {
    onSort(sort);
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
            <FilterDropdownMenu
              title="Filter by"
              options={friendFilterOptions}
              onChange={handleFilterSelected}
            />
          </ShowIf>
          <ShowIf condition={!disableSort}>
            <DropdownMenu title={'Sort by'} options={sortOptions} onChange={handleSortChanged} />
          </ShowIf>
        </Grid>
      </ShowIf>

      {router.pathname === '/profile/[id]' ? (
        <div
          style={{
            background: 'white',
            borderRadius: `20px 20px 0px 0px`,
            padding: `24px 0px`,
          }}>
          <div className={style.p3}>
            <SearchComponent onSubmit={handleSearch} placeholder={'Search friend'} />
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
                    <Avatar className={style.avatar} alt={'name'} src={friend.avatar}>
                      {acronym(friend.name)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    <Link href={`/profile/${friend.id}`}>
                      <a href={`/profile/${friend.id}`} className={style.link}>
                        <Typography className={style.name} component="span" color="textPrimary">
                          {friend.name}
                        </Typography>
                      </a>
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
      ) : (
        <>
          <div className={style.p3}>
            <SearchComponent onSubmit={handleSearch} placeholder={'Search friend'} />
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
                    <Avatar className={style.avatar} alt={'name'} src={friend.avatar}>
                      {acronym(friend.name)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    <Link href={`/profile/${friend.id}`}>
                      <a href={`/profile/${friend.id}`} className={style.link}>
                        <Typography className={style.name} component="span" color="textPrimary">
                          {friend.name}
                        </Typography>
                      </a>
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
        </>
      )}

      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Finding this post is insightful? Send a tip!">
        <SendTipContainer />
      </Modal>

      {currentFriend && currentFriend.username === 'myriad_official' ? (
        <Menu
          id={currentFriend.id}
          anchorEl={anchorEl}
          style={{width: 170}}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseFriendSetting}>
          <MenuItem onClick={handleVisitProfile}>Visit profile</MenuItem>
          <MenuItem disabled={balanceDetails.length === 0} onClick={handleSendTip}>
            Send direct tip
          </MenuItem>
        </Menu>
      ) : (
        <Menu
          id={currentFriend?.id ?? 'friend-id'}
          anchorEl={anchorEl}
          style={{width: 170}}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseFriendSetting}>
          <MenuItem onClick={handleVisitProfile}>Visit profile</MenuItem>
          <MenuItem disabled={balanceDetails.length === 0} onClick={handleSendTip}>
            Send direct tip
          </MenuItem>
          <MenuItem className={style.danger} onClick={handleUnfriend}>
            Unfriend
          </MenuItem>
          <MenuItem className={style.danger} onClick={handleBlock}>
            Block this person
          </MenuItem>
        </Menu>
      )}

      <PromptComponent
        onCancel={closeConfirmRemoveFriend}
        open={openRemoveFriend}
        icon="danger"
        title={`Unfriend ${currentFriend ? currentFriend.name : 'Unknown'}?`}
        subtitle="You will not able to search and see post from this user">
        <div className={`${style.flexCenter}`}>
          <Button
            onClick={closeConfirmRemoveFriend}
            className={style.m1}
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
        </div>
      </PromptComponent>

      <PromptComponent
        onCancel={closeConfirmBlockUser}
        open={openBlockUser}
        icon="danger"
        title="Block User?"
        subtitle="You will not able to search and see post from this user">
        <div className={`${style.flexCenter}`}>
          <Button
            onClick={closeConfirmBlockUser}
            className={style.m1}
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
        </div>
      </PromptComponent>

      <PromptComponent
        icon={'success'}
        open={openSuccessPrompt}
        onCancel={handleCloseSuccessPrompt}
        title={'Success'}
        subtitle={
          <Typography component="div">
            Tip to{' '}
            <Box fontWeight={700} display="inline">
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
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleCloseSuccessPrompt}>
            Return
          </Button>
        </div>
      </PromptComponent>
    </div>
  );
};
