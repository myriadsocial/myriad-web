import {DotsHorizontalIcon} from '@heroicons/react/outline';

import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useDispatch} from 'react-redux';

import Link from 'next/link';
import {useRouter} from 'next/router';

import {IconButton, Menu, MenuItem, Button} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {FilterDropdownMenu} from '../atoms/FilterDropdownMenu';
import {PromptComponent} from '../atoms/Prompt/prompt.component';
import SearchComponent from '../atoms/Search/SearchBox';
import {friendFilterOptions, FriendType} from './default';
import {FriendListProps} from './default';
import {useStyles} from './friend.style';
import {FriendDetail, useFriendList} from './hooks/use-friend-list.hook';

import {SendTipContainer} from 'src/components-v2/SendTip';
import {Empty} from 'src/components-v2/atoms/Empty';
import {Loading} from 'src/components-v2/atoms/Loading';
import {Modal} from 'src/components-v2/atoms/Modal';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import {useToasterHook} from 'src/hooks/use-toaster.hook';
import {Status} from 'src/interfaces/toaster';
import {blockedFriendList, removedFriendList} from 'src/reducers/friend/actions';

export const FriendListComponent: React.FC<FriendListProps> = props => {
  const {
    friends,
    user,
    hasMore,
    background = false,
    disableFilter = false,
    onSearch,
    onFilter,
    onLoadNextPage,
  } = props;
  const style = useStyles();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentFriend, setCurrentFriend] = useState<null | FriendDetail>(null);
  const [sendTipOpened, setSendTipOpened] = useState(false);
  const [friendList, setFriendList] = useState<FriendDetail[]>([]);
  const [openRemoveFriend, setOpenRemoveFriend] = useState(false);
  const [openBlockUser, setOpenBlockUser] = useState(false);

  const {openToaster} = useToasterHook();

  const dispatch = useDispatch();

  useEffect(() => {
    const list = useFriendList(friends, user);
    setFriendList(list);
  }, [friends, user]);

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
      router.push(`/profile/${currentFriend.id}`);
    }

    handleCloseFriendSetting();
  };

  const closeSendTip = () => {
    setSendTipOpened(false);
  };

  const handleSendTip = () => {
    setSendTipOpened(true);
    handleCloseFriendSetting();
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

      openToaster({
        message: `${currentFriend?.name} has removed from your friend list`,
        toasterStatus: Status.SUCCESS,
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

      openToaster({
        message: 'User successfully blocked',
        toasterStatus: Status.SUCCESS,
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
      <ShowIf condition={!disableFilter}>
        <FilterDropdownMenu
          title="Filter by"
          options={friendFilterOptions}
          onChange={handleFilterSelected}
        />
      </ShowIf>

      <div className={style.list}>
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
                <Typography className={style.friend} component="p" color="textSecondary">
                  1 mutual friends
                </Typography>
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

      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Finding this post is insightful? Send a tip!">
        <SendTipContainer />
      </Modal>

      <Menu
        id="friend-setting"
        anchorEl={anchorEl}
        style={{width: 170}}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseFriendSetting}>
        <MenuItem onClick={handleVisitProfile}>Visit profile</MenuItem>
        <MenuItem onClick={handleSendTip}>Send direct tip</MenuItem>
        <MenuItem className={style.danger} onClick={handleUnfriend}>
          Unfriend
        </MenuItem>
        <MenuItem className={style.danger} onClick={handleBlock}>
          Block this person
        </MenuItem>
      </Menu>

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
    </div>
  );
};
