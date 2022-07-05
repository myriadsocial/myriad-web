import React, {useCallback, useRef} from 'react';
import {useDispatch} from 'react-redux';

import {Collapse, Paper} from '@material-ui/core';

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
import {Text} from 'components/atoms/Text';
import {useToggle} from 'src/hooks/use-toggle.hook';
import {SectionType} from 'src/interfaces/interaction';
import {deletePost, editPost} from 'src/reducers/timeline/actions';

export const PostDetailContainer: React.FC<PostDetailContainerProps> = props => {
  const {post, type, expandComment = false, user} = props;

  const styles = useStyles();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const report = useReport();
  const ref = useRef<HTMLDivElement>(null);

  const {selected, setSelected, tabs} = useCommentTabs(post, ref, user);
  const {upvotePost, toggleDownvotePost, removePostVote} = usePostInteractionHook();

  const [showImporterList, toggleImporterList] = useToggle(false);
  const [showVisibility, toggleVisibility] = useToggle(false);
  const [showComment, toggleComments] = useToggle(expandComment);

  const handleToggleDownvotePost = useCallback(() => {
    toggleDownvotePost(post);

    toggleComments();
  }, []);

  const handleToggleShowComment = useCallback(() => {
    toggleComments();
  }, []);

  const handleChangeTab = useCallback((tab: SectionType) => {
    setSelected(tab);

    toggleDownvotePost(null);
  }, []);

  const handleVisibilityChange = useCallback((visibility: string) => {
    dispatch(
      editPost(post.id, visibility, () => {
        confirm({
          title: <Text locale="Post_Visibility_Setting.Confirm.Title" />,
          description: (
            <Text locale="Post_Visibility_Setting.Confirm.Description" values={{visibility}} />
          ),
          confirmationText: <Text locale="Post_Visibility_Setting.Confirm.Label" />,
          hideCancel: true,
        });
      }),
    );
  }, []);

  const handleDeletePost = useCallback(() => {
    confirm({
      title: <Text locale="Post_Delete.Title" />,
      description: <Text locale="Post_Delete.Description" />,
      icon: 'danger',
      confirmationText: <Text locale="Post_Delete.Confirmation_Text" />,
      cancellationText: <Text locale="Post_Delete.Cancellation_Text" />,
      onConfirm: () => {
        dispatch(deletePost(post.id));
      },
    });
  }, []);

  const handleReport = useCallback(() => {
    report.open(post);
  }, []);

  const initComments = () => {
    handleChangeTab(SectionType.DISCUSSION);
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
          <TabsComponent<SectionType>
            tabs={tabs}
            position="space-evenly"
            selected={selected as SectionType}
            onChangeTab={handleChangeTab}
          />
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
