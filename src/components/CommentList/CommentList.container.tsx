import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import dynamic from 'next/dynamic';

import useConfirm from '../common/Confirm/use-confirm.hook';
import {CommentList} from './CommentList';

import {debounce} from 'lodash';
import {ReportContainer} from 'src/components/Report';
import {TipHistoryContainer} from 'src/components/TipHistory';
import ShowIf from 'src/components/common/show-if.component';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useBlockList} from 'src/hooks/use-blocked-list.hook';
import {useCommentHook} from 'src/hooks/use-comment.hook';
import {Comment, CommentProps} from 'src/interfaces/comment';
import {SectionType, ReferenceType, Vote} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {loadUsers, searchUsers} from 'src/reducers/search/actions';
import {downvote, removeVote, upvote} from 'src/reducers/timeline/actions';
import {UserState} from 'src/reducers/user/reducer';

const CommentEditor = dynamic(() => import('../CommentEditor/CommentEditor'), {ssr: false});

type CommentListContainerProps = {
  referenceId: string;
  placeholder?: string;
  section: SectionType;
  focus?: boolean;
  expand?: boolean;
  scrollToPost: () => void;
};

export const CommentListContainer: React.FC<CommentListContainerProps> = props => {
  const {placeholder, referenceId, section, focus, expand, scrollToPost} = props;

  const dispatch = useDispatch();
  const confirm = useConfirm();
  const {
    comments,
    hasMoreComment,
    loadInitComment,
    reply,
    updateDownvote,
    loadMoreComment,
    updateUpvote,
    updateRemoveUpvote,
    remove,
  } = useCommentHook(referenceId);

  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const people = useSelector<RootState, User[]>(state => state.searchState.searchedUsers);
  const downvoting = useSelector<RootState, Post | Comment | null>(
    state => state.timelineState.interaction.downvoting,
  );

  const {blockedUserIds, loadAll: loadAllBlockedUsers} = useBlockList(user);
  const {openTipHistory} = useTipHistory();

  const [reported, setReported] = useState<Comment | null>(null);

  useEffect(() => {
    loadAllBlockedUsers();
    dispatch(loadUsers());
  }, []);

  useEffect(() => {
    loadInitComment(section);
  }, [referenceId]);

  const handleSubmitComment = (comment: Partial<CommentProps>) => {
    if (user) {
      const attributes: CommentProps = {
        ...comment,
        postId: referenceId,
        referenceId: comment.referenceId ?? referenceId,
        type: comment.type ?? ReferenceType.POST,
        userId: user.id,
        section: comment.section ?? section,
      } as CommentProps;

      reply(user, attributes, () => {
        if (downvoting) {
          dispatch(
            downvote(downvoting, section, (vote: Vote) => {
              // update vote count if reference is a comment
              if ('section' in downvoting) {
                updateDownvote(downvoting.id, downvoting.metric.downvotes + 1, vote);
              }
            }),
          );
        }
      });
    }
  };

  const handleUpvote = (comment: Comment) => {
    if (comment.isUpvoted) {
      handleRemoveVote(comment);
    } else {
      dispatch(
        upvote(comment, section, (vote: Vote) => {
          updateUpvote(comment.id, comment.metric.upvotes + 1, vote);
        }),
      );
    }
  };

  const handleRemoveVote = (comment: Comment) => {
    dispatch(
      removeVote(comment, () => {
        updateRemoveUpvote(comment.id);
      }),
    );
  };

  const showConfirmDeleteDialog = (comment: Comment): void => {
    confirm({
      title: i18n.t('Post_Comment.Confirm_Delete.Title'),
      description: i18n.t('Post_Comment.Confirm_Delete.Description'),
      icon: 'danger',
      confirmationText: i18n.t('Post_Comment.Confirm_Delete.Confirm_Text'),
      cancellationText: i18n.t('Post_Comment.Confirm_Delete.Cancel_Text'),
      onConfirm: () => {
        remove(comment);
      },
    });
  };

  const handleReport = (comment: Comment) => {
    setReported(comment);
  };

  const closeReportPost = () => {
    setReported(null);
  };

  const handleSearchPeople = debounce((query: string) => {
    if (user) {
      dispatch(searchUsers(query));
    }
  }, 300);

  const handleLoadMoreComment = (): void => {
    loadMoreComment();
  };

  return (
    <>
      <ShowIf condition={!anonymous}>
        <CommentEditor
          referenceId={referenceId}
          placeholder={placeholder}
          user={user}
          expand={expand}
          mentionables={people.map(item => ({
            value: item.id,
            name: item.name,
            username: item.username ?? item.name.replace(' ', ''),
            avatar: item.profilePictureURL,
          }))}
          onSearchMention={handleSearchPeople}
          onSubmit={handleSubmitComment}
        />
      </ShowIf>

      <CommentList
        section={section}
        user={user}
        mentionables={people}
        blockedUserIds={blockedUserIds}
        placeholder={placeholder}
        focus={focus}
        expand={expand}
        comments={comments || []}
        hasMoreComment={hasMoreComment}
        onLoadMoreComments={handleLoadMoreComment}
        onUpvote={handleUpvote}
        onRemoveVote={handleRemoveVote}
        onUpdateDownvote={updateDownvote}
        onReport={handleReport}
        onOpenTipHistory={openTipHistory}
        onSearchPeople={handleSearchPeople}
        onDelete={showConfirmDeleteDialog}
        scrollToPost={scrollToPost}
      />

      <TipHistoryContainer referenceType={ReferenceType.COMMENT} />

      <ReportContainer reference={reported} onClose={closeReportPost} />
    </>
  );
};

export default CommentListContainer;
