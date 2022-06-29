import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import useConfirm from '../common/Confirm/use-confirm.hook';
import {PostDetail} from './PostDetail';
import {usePostDelete} from './hooks/use-post-delete.hook';
import {usePostInteraction} from './hooks/use-post-interaction.hook';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {PostVisibilityContainer} from 'src/components/PostVisibility';
import {useTimelineHook} from 'src/components/Timeline/hooks/use-timeline.hook';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {ReferenceType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {removeImporter} from 'src/reducers/importers/actions';
import {UserState} from 'src/reducers/user/reducer';

type PostDetailContainerProps = {
  type?: 'share' | 'default';
  expanded?: boolean;
};

const ReportContainer = dynamic(() => import('../Report/Report.container'), {ssr: false});
const TipHistoryContainer = dynamic(() => import('../TipHistory/TipHistory.container'), {
  ssr: false,
});
const PostImporterContainer = dynamic(() => import('../PostImporterList/PostImporter.container'), {
  ssr: false,
});

export const PostDetailContainer: React.FC<PostDetailContainerProps> = props => {
  const {type = 'default', expanded = true} = props;

  const dispatch = useDispatch();
  const confirm = useConfirm();

  const {post} = useTimelineHook();
  const {openTipHistory} = useTipHistory();
  const enqueueSnackbar = useEnqueueSnackbar();
  const {confirmDeletePost} = usePostDelete();
  const {upVotePost, setDownVotingPost, removePostVote} = usePostInteraction();

  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const [visibility, setVisibility] = useState<Post | null>(null);
  const [reported, setReported] = useState<Post | null>(null);
  const [importedPost, setImportedPost] = useState<Post | null>(null);

  const handleSharePost = (post: Post, type: 'link' | 'post') => {
    if (type === 'post') {
      enqueueSnackbar({
        message: 'This post successfully share to your timeline',
        variant: 'success',
      });
    }
  };

  const handleReportPost = (post: Post) => {
    setReported(post);
  };

  const closeReportPost = () => {
    setReported(null);
  };

  const handleImporters = (post: Post) => {
    dispatch(removeImporter());
    setImportedPost(post);
  };

  const closeImportedPost = () => {
    setImportedPost(null);
  };

  const handlePostVisibility = (post: Post) => {
    setVisibility(post);
  };

  const closePostVisibility = () => {
    setVisibility(null);
  };

  const confirmRemovePost = () => {
    confirm({
      title: i18n.t('Post_Delete.Title'),
      description: i18n.t('Post_Delete.Description'),
      icon: 'danger',
      confirmationText: i18n.t('Post_Delete.Confirmation_Text'),
      cancellationText: i18n.t('Post_Delete.Cancellation_Text'),
      onConfirm: () => {
        confirmDeletePost();
      },
    });
  };

  if (!post) return null;

  return (
    <>
      <PostDetail
        user={user}
        key={`post-${post.id}`}
        post={post}
        anonymous={anonymous}
        onUpvote={upVotePost}
        toggleDownvoting={setDownVotingPost}
        onOpenTipHistory={openTipHistory}
        onDelete={confirmRemovePost}
        onReport={handleReportPost}
        onImporters={handleImporters}
        onShared={handleSharePost}
        onRemoveVote={removePostVote}
        onVisibility={handlePostVisibility}
        expanded={expanded}
        type={type}
      />

      <TipHistoryContainer referenceType={ReferenceType.POST} />
      <ReportContainer reference={reported} onClose={closeReportPost} />
      <PostImporterContainer post={importedPost} onClose={closeImportedPost} />
      <PostVisibilityContainer reference={visibility} onClose={closePostVisibility} />
    </>
  );
};
