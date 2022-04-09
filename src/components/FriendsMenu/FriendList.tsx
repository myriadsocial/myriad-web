import {DotsHorizontalIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useSelector, useDispatch} from 'react-redux';

import Link from 'next/link';
import {useRouter} from 'next/router';

import {IconButton, Menu, MenuItem, Grid} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {Avatar, AvatarSize} from '../atoms/Avatar';
import {DropdownMenu} from '../atoms/DropdownMenu';
import SearchComponent from '../atoms/Search/SearchBox';
import useConfirm from '../common/Confirm/use-confirm.hook';
import useTipping from '../common/Tipping/use-tipping.hook';
import {friendFilterOptions, FriendType, sortOptions} from './default';
import {useStyles} from './friend.style';
import {UserWithMutual, useFriendList} from './hooks/use-friend-list.hook';

import {Empty} from 'src/components/atoms/Empty';
import {Loading} from 'src/components/atoms/Loading';
import ShowIf from 'src/components/common/show-if.component';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Friend} from 'src/interfaces/friend';
import {ReferenceType} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';
import * as UserAPI from 'src/lib/api/user';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {blockFromFriend, removeFromFriend} from 'src/reducers/friend/actions';
import {UserState} from 'src/reducers/user/reducer';

export type FriendListProps = {
  type?: 'contained' | 'basic';
  user?: User;
  isFiltered: boolean;
  background?: boolean;
  disableFilter?: boolean;
  disableSort?: boolean;
  friends: Friend[];
  hasMore: boolean;
  onSearch: (query: string) => void;
  onFilter: (type: FriendType) => void;
  onSort: (sort: SortType) => void;
  onLoadNextPage: () => void;
};

export const FriendListComponent: React.FC<FriendListProps> = props => {
  const {
    type,
    friends,
    user,
    hasMore,
    isFiltered,
    background = false,
    disableFilter = false,
    disableSort = false,
    onSearch,
    onFilter,
    onSort,
    onLoadNextPage,
  } = props;
  const style = useStyles({...props, type, disableFilter});
  const router = useRouter();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const tipping = useTipping();

  const {openToasterSnack} = useToasterSnackHook();
  const {friendList, removeFromFriendList} = useFriendList(friends, user);

  const {user: currentUser} = useSelector<RootState, UserState>(state => state.userState);
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentFriend, setCurrentFriend] = useState<null | UserWithMutual>(null);

  const handleOpenFriendSetting =
    (currentFriend: UserWithMutual) => (event: React.MouseEvent<HTMLButtonElement>) => {
      setCurrentFriend(currentFriend);
      setAnchorEl(event.currentTarget);
    };

  const handleCloseFriendSetting = () => {
    setAnchorEl(null);
  };

  const handleSendTip = async () => {
    handleCloseFriendSetting();

    try {
      const user = currentFriend as User;
      const walletDetail = await UserAPI.getWalletAddress(user.id);
      const receiver = {...user, walletDetail};

      tipping.send({
        receiver,
        reference: user as User,
        referenceType: ReferenceType.USER,
      });
    } catch {
      confirm({
        title: 'Wallet account not found',
        description: 'This comment wallet address is unavailable',
        icon: 'warning',
        confirmationText: 'close',
        hideCancel: true,
      });
    }
  };

  const handleVisitProfile = () => {
    handleCloseFriendSetting();

    if (!currentFriend) {
      router.push('/404');
    } else {
      router.push(`/profile/${currentFriend.id}`, undefined, {shallow: false});
    }
  };

  const handleUnfriend = () => {
    handleCloseFriendSetting();

    if (!currentFriend) {
      router.push('/404');
    } else {
      confirm({
        title: `Unfriend ${currentFriend ? currentFriend.name : 'User'}?`,
        description:
          "You won't be shown their posts in your timeline anymore and you might not be able to see their complete profile. Are you sure?",
        icon: 'danger',
        confirmationText: 'Unfriend Now',
        onConfirm: () => {
          handleRemoveFriend();
        },
      });
    }
  };

  const handleBlock = () => {
    if (!currentFriend) {
      router.push('/404');
    } else {
      confirm({
        title: `Block ${currentFriend ? currentFriend.name : 'User'}?`,
        description:
          "You won't be shown their posts in your timeline anymore and you might not be able to see their complete profile. Are you sure?",
        icon: 'danger',
        confirmationText: 'Block Now',
        onConfirm: () => {
          handleBlockUser();
        },
      });
    }
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

      openToasterSnack({
        message: 'User successfully blocked',
        variant: 'success',
      });

      setCurrentFriend(null);
    }
  };

  const handleSort = (sort: string) => {
    onSort(sort as SortType);
  };

  if (friends.length === 0 && !isFiltered) {
    return (
      <Empty title="Friend list is empty" subtitle="Find or invite your friends to Myriad 😉" />
    );
  }

  return (
    <div className={style.box}>
      <ShowIf condition={!disableFilter || !disableSort}>
        <Grid container alignItems="center" className={style.filterBox}>
          <ShowIf condition={!disableFilter}>
            <div className={style.filter}>
              <DropdownMenu
                title="Filter by"
                options={friendFilterOptions}
                onChange={handleFilterSelected}
              />
            </div>
          </ShowIf>
          <ShowIf condition={!disableSort}>
            <DropdownMenu title={'Sort by'} options={sortOptions} onChange={handleSort} />
          </ShowIf>
        </Grid>
      </ShowIf>

      <div className={style.root}>
        <div className={style.search}>
          <SearchComponent
            onSubmit={onSearch}
            placeholder={'Search friend'}
            iconPosition={'end'}
            outlined={true}
          />
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
                    <Avatar
                      name={friend.name}
                      src={friend.profilePictureURL}
                      size={AvatarSize.MEDIUM}
                    />
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

      <Menu
        id={currentFriend?.id ?? 'friend-id'}
        anchorEl={anchorEl}
        style={{width: 170}}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseFriendSetting}>
        <MenuItem onClick={handleVisitProfile}>Visit profile</MenuItem>
        <MenuItem
          disabled={
            balanceDetails.length === 0 || currentFriend?.id === currentUser?.id || !tipping.enabled
          }
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
    </div>
  );
};
