import {DotsHorizontalIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Link from 'next/link';
import {useRouter} from 'next/router';

import {IconButton, Menu, MenuItem} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {FilterDropdownMenu} from '../atoms/FilterDropdownMenu';
import SearchComponent from '../atoms/Search/SearchBox';
import {friendFilterOptions, FriendType} from './default';
import {FriendListProps} from './default';
import {useStyles} from './friend.style';
import {FriendDetail, useFriendList} from './hooks/use-friend-list.hook';

import {Empty} from 'src/components-v2/atoms/Empty';
import {Loading} from 'src/components-v2/atoms/Loading';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';

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
  const [friendId, setFriendId] = useState('');

  const handleOpenFriendSetting =
    (friend: FriendDetail) => (event: React.MouseEvent<HTMLButtonElement>) => {
      setFriendId(friend.id);
      setAnchorEl(event.currentTarget);
    };

  const handleCloseFriendSetting = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleVisitProfile = () => {
    router.push(`/profile/${friendId}`);
    setAnchorEl(null);
  };

  const handleSendTip = () => {
    setAnchorEl(null);
  };

  const handleUnfriend = () => {
    handleClose();
  };

  const handleBlock = () => {
    handleClose();
  };

  const list = useFriendList(friends, user);

  const handleFilterSelected = (selected: string) => {
    onFilter(selected as FriendType);
  };

  const handleSearch = (query: string) => {
    onSearch(query);
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
          dataLength={list.length}
          hasMore={hasMore}
          next={onLoadNextPage}
          loader={<Loading />}>
          {list.map(friend => (
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
                  classes={{root: style.bgIcon}}
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

          <Menu
            id="friend-setting"
            anchorEl={anchorEl}
            style={{width: 170}}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseFriendSetting}
            MenuListProps={{onMouseLeave: handleClose}}>
            <MenuItem onClick={handleVisitProfile}>Visit profile</MenuItem>
            <MenuItem onClick={handleSendTip}>Send direct tip</MenuItem>
            <MenuItem className={style.danger} onClick={handleUnfriend}>
              Unfriend
            </MenuItem>
            <MenuItem className={style.danger} onClick={handleBlock}>
              Block this person
            </MenuItem>
          </Menu>
        </InfiniteScroll>
      </List>
    </div>
  );
};
