import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Lottie from 'react-lottie';

import Link from 'next/link';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {acronym} from '../../helpers/string';
import LoadingAnimation from '../../lottie/loading.json';
import {FilterDropdownMenu} from '../atoms/FilterDropdownMenu';
import SearchComponent from '../atoms/Search/SearchBox';
import {friendFilterOptions, FriendType} from './default';
import {FriendListProps} from './default';
import {useStyles} from './friend.style';
import {useFriendList} from './hooks/use-friend-list.hook';

import {Empty} from 'src/components-v2/atoms/Empty';
import ShowIf from 'src/components/common/show-if.component';

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

  const list = useFriendList(friends, user);

  const lottieLoading = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

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

      <SearchComponent onSubmit={handleSearch} placeholder={'Search friend'} />

      <List className={style.list}>
        <InfiniteScroll
          scrollableTarget="scrollable-timeline"
          dataLength={list.length}
          hasMore={hasMore}
          next={onLoadNextPage}
          loader={<Lottie options={lottieLoading} height={50} width={50} />}>
          {list.map(friend => (
            <ListItem
              key={friend.id}
              classes={{root: background ? style.backgroundEven : ''}}
              className={style.item}
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
            </ListItem>
          ))}
        </InfiniteScroll>
      </List>
    </div>
  );
};
