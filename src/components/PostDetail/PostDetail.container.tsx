import React, {useCallback, useRef} from 'react';
import {useDispatch} from 'react-redux';

import {Collapse, Paper, Typography} from '@material-ui/core';

import useConfirm from '../common/Confirm/use-confirm.hook';
import {PostDetail} from './PostDetail';
import {PostDetailContainerProps} from './PostDetail.interface';
import {useStyles} from './PostDetail.styles';
import {useCommentTabs} from './hooks/use-comment-tabs';
import {usePostInteractionHook} from './hooks/use-post-interaction.hook';

import {PostImporter} from 'components/PostImporterList';
import {PostVisibility} from 'components/PostVisibility';
import useReport from 'components/Report/use-report.hook';
import {TabsComponent} from 'components/atoms/Tabs';
import {useToggle} from 'src/hooks/use-toggle.hook';
import {SectionType} from 'src/interfaces/interaction';
import {Post, PostVisibility as Visibility} from 'src/interfaces/post';
import i18n from 'src/locale';
import {deletePost, editPost} from 'src/reducers/timeline/actions';

export const PostDetailContainer: React.FC<PostDetailContainerProps> = props => {
  const {post, type, expandComment = false, user} = props;

  const styles = useStyles();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const report = useReport();
  const ref = useRef<HTMLDivElement>(null);

  const {selected, setSelected, tabs} = useCommentTabs(post, ref, user, expandComment);
  const {upvotePost, toggleDownvotePost, removePostVote} = usePostInteractionHook();

  const [showImporterList, toggleImporterList] = useToggle(false);
  const [showVisibility, toggleVisibility] = useToggle(false);
  const [showComment, toggleComments] = useToggle(expandComment);

  const handleToggleDownvotePost = useCallback(() => {
    toggleDownvotePost(post);

    setSelected(SectionType.DEBATE);

    if (!showComment) {
      toggleComments();
    }
  }, []);

  const handleToggleShowComment = useCallback(() => {
    toggleComments();
  }, []);

  const handleChangeTab = useCallback((tab: SectionType) => {
    setSelected(tab);

    toggleDownvotePost(null);
  }, []);

  const handleVisibilityChange = useCallback((visibility: Visibility) => {
    toggleVisibility();

    const payload: Partial<Post> = {
      visibility,
    };

    if (visibility === Visibility.PRIVATE) {
      confirmChangeToPrivate(payload);
    } else {
      handleUpdatePost(payload);
    }
  }, []);

  const confirmChangeToPrivate = (payload: Partial<Post>) => {
    confirm({
      title: i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Private_Title'),
      description: i18n.t(
        'Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Private_Description',
      ),
      confirmationText: i18n.t(
        'Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Private_Text',
      ),
      cancellationText: i18n.t(
        'Post_Detail.Post_Options.Post_Visibility_Setting.Cancel_Private_Text',
      ),
      onConfirm: () => {
        handleUpdatePost(payload);
      },
    });
  };

  const handleUpdatePost = (payload: Partial<Post>) => {
    dispatch(
      editPost(post.id, payload, () => {
        openSuccessPrompt(payload.visibility);
      }),
    );
  };

  const openSuccessPrompt = (updatedVisibility: string) => {
    confirm({
      title: i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Title'),
      description: (
        <Typography>
          {updatedVisibility === Visibility.FRIEND
            ? i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Description', {
                visibility: 'Friend Only',
              })
            : updatedVisibility === Visibility.PRIVATE
            ? i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Description', {
                visibility: 'Only Me',
              })
            : i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Description', {
                visibility: updatedVisibility,
              })}
        </Typography>
      ),
      confirmationText: i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Confirm_Text'),
      hideCancel: true,
    });
  };

  const handleDeletePost = useCallback(() => {
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
  }, []);

  const handleReport = useCallback(() => {
    report.open(post);
  }, []);

  const initComments = () => {
    if (!selected) {
      handleChangeTab(SectionType.DISCUSSION);
    }
  };

  return (
    <>
      <Paper ref={ref} className={styles.root}>
        <PostDetail
          {...props}
          type={type}
          onUpvote={upvotePost}
          onToggleDownvote={handleToggleDownvotePost}
          onRemoveVote={removePostVote}
          onToggleShowComment={handleToggleShowComment}
          onShowImporters={toggleImporterList}
          onChangeVisibility={toggleVisibility}
          onDelete={handleDeletePost}
          onReport={handleReport}
        />
        <Collapse in={showComment} onEntering={initComments}>
          {selected && (
            <TabsComponent<SectionType>
              tabs={tabs}
              position="space-evenly"
              selected={selected}
              onChangeTab={handleChangeTab}
            />
          )}
        </Collapse>
      </Paper>

      <PostImporter open={showImporterList} post={post} onClose={toggleImporterList} />
      <PostVisibility
        open={showVisibility}
        reference={post}
        onClose={toggleVisibility}
        onVisibilityChanged={handleVisibilityChange}
      />
    </>
  );
};
