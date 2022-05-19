import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {Empty} from '../atoms/Empty';
import {CommentHistoryList} from './CommentHistoryList';
import {useCommentHistory} from './hooks/use-comment-history.hook';

import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type CommentHistoryListContainerProps = {
  profile?: User;
};

export const CommentHistoryListContainer: React.FC<CommentHistoryListContainerProps> = props => {
  const {profile} = props;

  const {comments, hasMore, sort, load, loadMore, sortBy} = useCommentHistory(profile);

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const isProfileOwner = profile?.id == user?.id;

  useEffect(() => {
    load();
  }, []);

  if (comments.length === 0 && !isProfileOwner) {
    return (
      <div style={{marginTop: 30}}>
        <Empty
          title={i18n.t('Profile.Comments.Empty.Title')}
          subtitle={i18n.t('Profile.Comments.Empty.Subtitle')}
        />
      </div>
    );
  }

  if (comments.length === 0 && isProfileOwner) {
    return (
      <div style={{marginTop: 30}}>
        <Empty
          title={i18n.t('Profile.Comments.Empty.Title')}
          subtitle={i18n.t('Profile.Comments.Empty.Subtitle_Own')}
        />
      </div>
    );
  }

  return (
    <>
      <CommentHistoryList
        comments={comments}
        user={user}
        hasMore={hasMore}
        sort={sort}
        loadMore={loadMore}
        onSort={sortBy}
      />
    </>
  );
};

export default CommentHistoryListContainer;
