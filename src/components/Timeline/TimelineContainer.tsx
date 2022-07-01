import {ArrowNarrowUpIcon} from '@heroicons/react/outline';

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import {Grid, Typography, Button, SvgIcon} from '@material-ui/core';

import {PostVisibilityContainer} from '../PostVisibility';
import {TimelineFilterContainer} from '../TimelineFilter';
import useConfirm from '../common/Confirm/use-confirm.hook';
import {useStyles} from './Timeline.styles';
import {useTimelineFilter} from './hooks/use-timeline-filter.hook';
import {useTimelineHook} from './hooks/use-timeline.hook';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import ShowIf from 'components/common/show-if.component';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {useScroll} from 'src/hooks/use-scroll.hook';
import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {TimelineFilter, TimelineType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {removeImporter} from 'src/reducers/importers/actions';
import {
  upvote,
  setDownvoting,
  deletePost,
  removeVote,
  checkNewTimeline,
} from 'src/reducers/timeline/actions';

type TimelineContainerProps = {
  filters?: TimelineFilter;
  fetchInitial?: boolean;
  filterType?: 'origin' | 'type';
  selectionType?: 'order' | 'sort';
  anonymous?: boolean;
  showCounter?: boolean;
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
  const {filters, fetchInitial = true, showCounter = false} = props;

  const style = useStyles();
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const {posts, hasMore, loading, nextPage, initTimeline} = useTimelineHook();
  const {filterTimeline} = useTimelineFilter(filters);
  const {query} = useQueryParams();
  const {openTipHistory} = useTipHistory();
  const enqueueSnackbar = useEnqueueSnackbar();
  const {scrollPosition} = useScroll();

  const user = useSelector<RootState, User | undefined>(state => state.userState.user);
  const anonymous = useSelector<RootState, boolean>(state => state.userState.anonymous);
  const [reported, setReported] = useState<Post | null>(null);
  const [importedPost, setImportedPost] = useState<Post | null>(null);
  const [visibility, setVisibility] = useState<Post | null>(null);
  const [newPostCount, setNewPostCount] = useState<number>(0);

  useEffect(() => {
    fetchInitial && filterTimeline(query);
  }, [query, fetchInitial]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkNewTimeline(setNewPostCount));
    }, 120000);
    return () => clearInterval(interval);
  }, []);

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
      enqueueSnackbar({
        message: i18n.t('Post_Share.Confirmation_Message'),
        variant: 'success',
      });
    }
  };

  const handleRemoveVote = (reference: Post | Comment) => {
    dispatch(removeVote(reference));
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
    setNewPostCount(0);
    initTimeline();
  };

  const handleLoadPost = () => {
    setNewPostCount(0);
    initTimeline();
  };

  return (
    <div className={style.box}>
      <Grid container justifyContent="space-between" alignItems="center">
        <TimelineFilterContainer {...props} />
      </Grid>

      <ShowIf condition={newPostCount > 0 && !loading && showCounter}>
        <div className={style.wrapperLoadPost} onClick={handleLoadPost}>
          <Typography color="primary">{i18n.t('Post_Lists.Load_New_Posts')}</Typography>
          <div className={style.badge}>
            <Typography className={style.badgeText}>
              {newPostCount > 50 ? '50+' : newPostCount}
            </Typography>
          </div>
        </div>
      </ShowIf>

      <ShowIf condition={scrollPosition > 0.23 && newPostCount > 0 && showCounter}>
        <Button
          color="primary"
          variant="contained"
          className={style.btnScrollTop}
          onClick={scrollToTop}
          startIcon={<SvgIcon component={ArrowNarrowUpIcon} viewBox="0 0 24 24" />}>
          {i18n.t('Post_Lists.New_Posts')}
        </Button>
      </ShowIf>

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
