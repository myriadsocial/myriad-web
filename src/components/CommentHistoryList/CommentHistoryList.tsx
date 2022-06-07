import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {Grid} from '@material-ui/core';

import {CommentHistory} from '../CommentHistory/CommentHistory';
import {MenuOptions} from '../atoms/DropdownMenu';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {useStyles} from './CommentHistoryList.style';

import {Loading} from 'src/components/atoms/Loading';
import {Comment} from 'src/interfaces/comment';
import {User} from 'src/interfaces/user';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';
import i18n from 'src/locale';

type CommentHistoryListProps = {
  user?: User;
  comments: Comment[];
  hasMore: boolean;
  sort: SortType;
  loadMore: () => void;
  onSort: (sort: SortType) => void;
};

export const CommentHistoryList: React.FC<CommentHistoryListProps> = props => {
  const {comments, user, hasMore, sort, loadMore, onSort} = props;

  const styles = useStyles();
  const sortOptions: MenuOptions<SortType>[] = [
    {id: 'DESC', title: i18n.t('Friends.Sort.Latest')},
    {id: 'ASC', title: i18n.t('Friends.Sort.Oldest')},
  ];

  return (
    <div className={styles.root}>
      <Grid container justifyContent="flex-end">
        <DropdownMenu<SortType>
          title={i18n.t('Profile.Comments.Sort')}
          options={sortOptions}
          selected={sort}
          onChange={onSort}
        />
      </Grid>

      <InfiniteScroll
        scrollableTarget="scrollable-timeline"
        dataLength={comments.length}
        hasMore={hasMore}
        next={loadMore}
        loader={<Loading />}>
        {comments.map(comment => (
          <CommentHistory key={comment.id} comment={comment} user={user} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
