import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import {Grid} from '@material-ui/core';

import {PostVisibilityContainer} from '../PostVisibility';
import {TimelineFilterContainer} from '../TimelineFilter';
import useConfirm from '../common/Confirm/use-confirm.hook';
import {useStyles} from './Timeline.styles';
import {useTimelineFilter} from './hooks/use-timeline-filter.hook';
import {useTimelineHook} from './hooks/use-timeline.hook';

import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {TimelineFilter, TimelineType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {removeImporter} from 'src/reducers/importers/actions';
import {upvote, setDownvoting, deletePost, removeVote} from 'src/reducers/timeline/actions';

type TimelineContainerProps = {
  filters?: TimelineFilter;
  fetchInitial?: boolean;
  filterType?: 'origin' | 'type';
  selectionType?: 'order' | 'sort';
  anonymous?: boolean;
};

const TimelineComponent = dynamic(() => import('./Timeline'), {ssr: false});
const ReportContainer = dynamic(() => import('../Report/Report.container'), {ssr: false});
const TipHistoryContainer = dynamic(() => import('../TipHistory/TipHistory.container'), {
  ssr: false,
});
const PostImporterContainer = dynamic(() => import('../PostImporterList/PostImporter.container'), {
  ssr: false,
});

export const TimelineContainer: React.FC<TimelineContainerProps> = props => {
  const {filters, fetchInitial = true} = props;

  const style = useStyles();
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const {posts, hasMore, loading, nextPage} = useTimelineHook();
  const {filterTimeline} = useTimelineFilter(filters);
  const {query} = useQueryParams();
  const {openTipHistory} = useTipHistory();
  const {openToasterSnack} = useToasterSnackHook();

  const user = useSelector<RootState, User | undefined>(state => state.userState.user);
  const anonymous = useSelector<RootState, boolean>(state => state.userState.anonymous);
  const [reported, setReported] = useState<Post | null>(null);
  const [importedPost, setImportedPost] = useState<Post | null>(null);
  const [visibility, setVisibility] = useState<Post | null>(null);

  useEffect(() => {
    fetchInitial && filterTimeline(query);
  }, [query, fetchInitial]);

  const handleUpvote = (reference: Post | Comment) => {
    dispatch(upvote(reference));
  };

  const handleToggleDownvoting = (reference: Post | Comment | null) => {
    dispatch(setDownvoting(reference));
  };

  const handleReportPost = (post: Post) => {
    setReported(post);
  };

  const handleImporters = (post: Post) => {
    dispatch(removeImporter());
    setImportedPost(post);
  };

  const closeImportedPost = () => {
    setImportedPost(null);
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

  const handleDeletePost = (post: Post) => {
    confirm({
      title: i18n.t('Post_Delete.Title'),
      description: i18n.t('Post_Delete.Description'),
      icon: 'danger',
      confirmationText: i18n.t('Post_Delete.Confirmation_Text'),
      cancellationText: i18n.t('Post_Delete.Cancellation_Text'),
      onConfirm: () => {
        dispatch(deletePost(post.id));
      },
    });
  };

  const handleSharePost = (post: Post, type: 'link' | 'post') => {
    if (type === 'post') {
      openToasterSnack({
        message: 'This post successfully share to your timeline',
        variant: 'success',
      });
    }
  };

  const handleRemoveVote = (reference: Post | Comment) => {
    dispatch(removeVote(reference));
  };

  return (
    <div className={style.box}>
      <Grid container justifyContent="space-between" alignItems="center">
        <TimelineFilterContainer {...props} />
      </Grid>

      <TimelineComponent
        timelineType={query.type as TimelineType}
        loading={loading}
        user={user}
        posts={posts}
        anonymous={anonymous}
        loadNextPage={nextPage}
        hasMore={hasMore}
        upvote={handleUpvote}
        onSendTip={console.log}
        onOpenTipHistory={openTipHistory}
        onDelete={handleDeletePost}
        onReport={handleReportPost}
        onVisibility={handlePostVisibility}
        toggleDownvoting={handleToggleDownvoting}
        onShared={handleSharePost}
        onRemoveVote={handleRemoveVote}
        onImporters={handleImporters}
      />

      <TipHistoryContainer referenceType={ReferenceType.POST} />
      <ReportContainer reference={reported} onClose={closeReportPost} />
      <PostImporterContainer post={importedPost} onClose={closeImportedPost} />
      <PostVisibilityContainer reference={visibility} onClose={closePostVisibility} />
    </div>
  );
};
