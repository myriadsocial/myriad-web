import {DotsHorizontalIcon, DotsVerticalIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useSelector, useDispatch} from 'react-redux';

import Link from 'next/link';
import {useRouter} from 'next/router';

import {Menu, MenuItem, Grid} from '@material-ui/core';
import BaseButton from '@material-ui/core/Button';
import BaseIconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {Avatar, AvatarSize} from '../atoms/Avatar';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {MenuOptions} from '../atoms/DropdownMenu';
import SearchComponent from '../atoms/Search/SearchBox';
import useConfirm from '../common/Confirm/use-confirm.hook';
import useTipping from '../common/Tipping/use-tipping.hook';
import {FriendType} from './default';
import {useStyles} from './friend.style';
import {UserWithMutual, useFriendList} from './hooks/use-friend-list.hook';

import {WithAuthorizeAction} from 'components/common/Authorization/WithAuthorizeAction';
import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {Empty} from 'src/components/atoms/Empty';
import {Loading} from 'src/components/atoms/Loading';
import ShowIf from 'src/components/common/show-if.component';
import {Friend} from 'src/interfaces/friend';
import {ReferenceType} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';
import * as UserAPI from 'src/lib/api/user';
import i18n from 'src/locale';
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
  isProfile: boolean;
  hasMore: boolean;
  onSearch: (query: string) => void;
  onFilter: (type: FriendType) => void;
  onSort: (sort: SortType) => void;
  onLoadNextPage: () => void;
};

const IconButton = WithAuthorizeAction(BaseIconButton);

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
    isProfile,
  } = props;
  const style = useStyles({...props, type, disableFilter});
  const router = useRouter();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const tipping = useTipping();

  const enqueueSnackbar = useEnqueueSnackbar();
  const {friendList, removeFromFriendList} = useFriendList(friends, user);

  const {user: currentUser} = useSelector<RootState, UserState>(state => state.userState);
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);
  const Button = WithAuthorizeAction(BaseButton);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentFriend, setCurrentFriend] = useState<null | UserWithMutual>(null);

  const friendFilterOptions: MenuOptions<FriendType>[] = [
    {
      id: 'all',
      title: i18n.t('Friends.Filter.All'),
    },
    {
      id: 'mutual',
      title: i18n.t('Friends.Filter.Mutual'),
    },
  ];

  const sortOptions: MenuOptions<SortType>[] = [
    {id: 'DESC', title: i18n.t('Friends.Sort.Latest')},
    {id: 'ASC', title: i18n.t('Friends.Sort.Oldest')},
  ];

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
        title: i18n.t('Friends.Prompt_Wallet.Title'),
        description: i18n.t('Friends.Prompt_Wallet.Desc'),
        icon: 'warning',
        confirmationText: i18n.t('Friends.Prompt_Wallet.Close'),
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
        title: i18n.t('Friends.Prompt_Unfriend.Title', {
          name: currentFriend ? currentFriend.name : 'User',
        }),
        description: i18n.t('Friends.Prompt_Unfriend.Desc'),
        icon: 'danger',
        confirmationText: i18n.t('Friends.Prompt_Unfriend.Btn'),
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
        title: i18n.t('Friends.Prompt_Block.Title', {
          name: currentFriend ? currentFriend.name : 'User',
        }),
        description: i18n.t('Friends.Prompt_Block.Desc'),
        icon: 'danger',
        confirmationText: i18n.t('Friends.Prompt_Block.Btn'),
        onConfirm: () => {
          handleBlockUser();
        },
      });
    }
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

      enqueueSnackbar({
        message: i18n.t('Friends.Alert.Removed', {
          name: currentFriend?.name,
        }),
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

      enqueueSnackbar({
        message: i18n.t('Friends.Alert.Block'),
        variant: 'success',
      });

      setCurrentFriend(null);
    }
  };

  if (friends.length === 0 && !isFiltered) {
    if (user.fullAccess)
      return (
        <Empty
          title={i18n.t('Friends.Empty.Friend_List.Title')}
          subtitle={i18n.t('Friends.Empty.Friend_List.Subtitle')}
        />
      );
    if (!isProfile)
      return (
        <Empty
          image={'/images/illustration/EmptyStateFriendReq.svg'}
          title={'Nothing to see here!'}
          subtitle="Connect your Web 3.0 wallet to unlock this feature"
          // eslint-disable-next-line react/no-children-prop
          children={
            <div style={{width: '100%', marginTop: 24}}>
              <Link href={{pathname: '/wallet', query: {type: 'manage'}}} shallow passHref>
                <Button onClick={() => undefined} color="primary" variant="contained" size="small">
                  {i18n.t('LiteVersion.ConnectWallet')}
                </Button>
              </Link>
            </div>
          }
          withImage
        />
      );
    return <Empty title={'Nothing to see here!'} subtitle="Friend list is empty." />;
  }

  return (
    <div className={style.box}>
      <ShowIf condition={!disableFilter || !disableSort}>
        <Grid container alignItems="center" className={style.filterBox}>
          <ShowIf condition={!disableFilter}>
            <div className={style.filter}>
              <DropdownMenu<FriendType>
                title={i18n.t('Friends.Filter.Title')}
                options={friendFilterOptions}
                onChange={onFilter}
              />
            </div>
          </ShowIf>
          <ShowIf condition={!disableSort}>
            <DropdownMenu<SortType>
              title={i18n.t('Friends.Sort.Title')}
              options={sortOptions}
              onChange={onSort}
            />
          </ShowIf>
        </Grid>
      </ShowIf>

      <div className={style.root}>
        <div className={style.search}>
          <SearchComponent
            onSubmit={onSearch}
            placeholder={i18n.t('Friends.Search.Placeholder')}
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
                      {i18n.t('Friends.List.Mutual', {total: friend.totalMutual})}
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

                <div className={style.mobile}>
                  <IconButton
                    aria-label="friend-setting"
                    onClick={handleOpenFriendSetting(friend)}
                    disableRipple={true}
                    disableFocusRipple={true}
                    disableTouchRipple>
                    <SvgIcon
                      classes={{root: style.icon2}}
                      component={DotsVerticalIcon}
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
        <MenuItem onClick={handleVisitProfile}>{i18n.t('Friends.Menu.Visit')}</MenuItem>
        <MenuItem
          disabled={
            balanceDetails.length === 0 || currentFriend?.id === currentUser?.id || !tipping.enabled
          }
          onClick={handleSendTip}>
          {i18n.t('Friends.Menu.Send_Tip')}
        </MenuItem>
        <ShowIf
          condition={
            currentUser?.id === user?.id &&
            (!currentFriend || currentFriend.username !== 'myriad_official')
          }>
          <MenuItem className={style.danger} onClick={handleUnfriend}>
            {i18n.t('Friends.Menu.Unfriend')}
          </MenuItem>

          <MenuItem className={style.danger} onClick={handleBlock}>
            {i18n.t('Friends.Menu.Block')}
          </MenuItem>
        </ShowIf>
      </Menu>
    </div>
  );
};
