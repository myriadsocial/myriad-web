import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { Collapse, Paper, Typography } from '@material-ui/core';

import useConfirm from '../common/Confirm/use-confirm.hook';
import { PostDetail } from './PostDetail';
import { PostDetailContainerProps } from './PostDetail.interface';
import { useStyles } from './PostDetail.styles';
import { useCommentTabs } from './hooks/use-comment-tabs';
import { usePostInteractionHook } from './hooks/use-post-interaction.hook';

import { PostImporter } from 'components/PostImporterList';
import { PostVisibility } from 'components/PostVisibility';
import useReport from 'components/Report/use-report.hook';
import { TabsComponent } from 'components/atoms/Tabs';
import { useToggle } from 'src/hooks/use-toggle.hook';
import { SectionType } from 'src/interfaces/interaction';
import { Post, PostVisibility as Visibility } from 'src/interfaces/post';
import i18n from 'src/locale';
import { deletePost, editPost } from 'src/reducers/timeline/actions';

export const PostDetailContainer: React.FC<PostDetailContainerProps> =
  props => {
    const { post, type, expand = false, user } = props;

    const styles = useStyles();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const report = useReport();
    const ref = useRef<HTMLDivElement>(null);

    const { selected, setSelected, tabs } = useCommentTabs(
      post,
      ref,
      user,
      expand,
    );
    const { upvotePost, toggleDownvotePost, removePostVote } =
      usePostInteractionHook();

    const [showImporterList, toggleImporterList] = useToggle(false);
    const [showVisibility, toggleVisibility] = useToggle(false);
    const [showComment, toggleComments] = useToggle(expand);

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

    const handleVisibilityChange = useCallback(
      (
        visibility: Visibility,
        selectedUserIds?: string[],
        selectedTimelineIds?: string[],
      ) => {
        toggleVisibility();

        const payload: Partial<Post> = {
          visibility,
          selectedUserIds,
          selectedTimelineIds,
        };

        if (visibility === Visibility.PRIVATE) {
          confirmChangeToPrivate(payload);
        } else {
          handleUpdatePost(payload);
        }
      },
      [],
    );

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
          key={props.post.id}
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
        <PostVisibility
          open={showVisibility}
          reference={post}
          onClose={toggleVisibility}
          onVisibilityChanged={handleVisibilityChange}
        />
      </>
    );
  };
