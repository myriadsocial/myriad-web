import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Grid from '@material-ui/core/Grid';

import {Skeleton as PostSkeleton} from '../PostDetail';
import {PostImporterContainer} from '../PostImporterList';
import {ReportContainer} from '../Report';
import {useTimelineHook} from '../Timeline/hooks/use-timeline.hook';
import {TipHistoryContainer} from '../TipHistory';
import {PostsList} from './PostsList';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {PostVisibilityContainer} from 'src/components/PostVisibility';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {TimelineOrderType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {removeImporter} from 'src/reducers/importers/actions';
import {setTimelineSort} from 'src/reducers/timeline/actions';
import {upvote, setDownvoting, removeVote} from 'src/reducers/timeline/actions';

type PostsListContainerProps = {
  anonymous?: boolean;
  query: string;
};

export const PostsListContainer: React.FC<PostsListContainerProps> = props => {
  const {query} = props;

  const dispatch = useDispatch();

  const {loading, page, posts, hasMore, order, searchPosts} = useTimelineHook();
  const {openTipHistory} = useTipHistory();
  const enqueueSnackbar = useEnqueueSnackbar();

  const user = useSelector<RootState, User | undefined>(state => state.userState.user);
  const anonymous = useSelector<RootState, boolean>(state => state.userState.anonymous);
  const [visibility, setVisibility] = useState<Post | null>(null);
  const [reported, setReported] = useState<Post | null>(null);
  const [importedPost, setImportedPost] = useState<Post | null>(null);

  const handleLoadNextPage = () => {
    searchPosts(query, page + 1);
  };

  const handleSort = (sort: TimelineOrderType) => {
    dispatch(setTimelineSort(sort));

    searchPosts(query);
  };

  const handleUpvote = (reference: Post | Comment) => {
    dispatch(upvote(reference));
  };

  const handleReportPost = (post: Post) => {
    setReported(post);
  };

  const handleImportedPost = (post: Post) => {
    setImportedPost(post);
  };

  const closeImporters = () => {
    setImportedPost(null);
    dispatch(removeImporter());
  };

  const closeReportPost = () => {
    setReported(null);
  };

  const handlePostVisibility = (post: Post) => {
    setVisibility(post);
  };

  const closePostVisibility = () => {
    setVisibility(null);
  };

  const handleSharePost = (post: Post, type: 'link' | 'post') => {
    if (type === 'post') {
      enqueueSnackbar({
        message: 'This post successfully share to your timeline',
        variant: 'success',
      });
    }
  };

  const handleToggleDownvoting = (reference: Post | Comment | null) => {
    dispatch(setDownvoting(reference));
  };

  const handleRemoveVote = (reference: Post | Comment) => {
    dispatch(removeVote(reference));
  };

  if (loading && posts.length === 0)
    return (
      <Grid container justifyContent="center">
        <PostSkeleton />
        <PostSkeleton />
      </Grid>
    );

  return (
    <>
      <PostsList
        user={user}
        order={order}
        anonymous={anonymous}
        loadNextPage={handleLoadNextPage}
        hasMore={hasMore}
        upvote={handleUpvote}
        onOpenTipHistory={openTipHistory}
        onReport={handleReportPost}
        onPostVisibility={handlePostVisibility}
        toggleDownvoting={handleToggleDownvoting}
        onShared={handleSharePost}
        searchedPosts={posts}
        onRemoveVote={handleRemoveVote}
        onImporters={handleImportedPost}
        onSort={handleSort}
      />

      <TipHistoryContainer referenceType={ReferenceType.POST} />
      <ReportContainer reference={reported} onClose={closeReportPost} />
      <PostImporterContainer post={importedPost} onClose={closeImporters} />
      <PostVisibilityContainer reference={visibility} onClose={closePostVisibility} />
    </>
  );
};
