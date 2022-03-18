import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import dynamic from 'next/dynamic';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {PromptComponent} from '../atoms/Prompt/prompt.component';
import useConfirm from '../common/Confirm/use-confirm.hook';
import {CommentList} from './CommentList';

import {debounce} from 'lodash';
import {ReportContainer} from 'src/components/Report';
import {TipHistoryContainer} from 'src/components/TipHistory';
import {Modal} from 'src/components/atoms/Modal';
import ShowIf from 'src/components/common/show-if.component';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useBlockList} from 'src/hooks/use-blocked-list.hook';
import {useCommentHook} from 'src/hooks/use-comment.hook';
import {Comment, CommentProps} from 'src/interfaces/comment';
import {SectionType, ReferenceType, Vote} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {loadUsers, searchUsers} from 'src/reducers/search/actions';
import {downvote, removeVote, upvote} from 'src/reducers/timeline/actions';
import {UserState} from 'src/reducers/user/reducer';
import {setTippedUser, setTippedUserId} from 'src/reducers/wallet/actions';
import {WalletState} from 'src/reducers/wallet/reducer';

const CommentEditor = dynamic(() => import('../CommentEditor/CommentEditor'), {ssr: false});
const SendTipContainer = dynamic(() => import('src/components/SendTip/SendTipContainer'), {
  ssr: false,
});

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
  const {isTipSent, explorerURL} = useSelector<RootState, WalletState>(state => state.walletState);

  const {blockedUserIds, loadAll: loadAllBlockedUsers} = useBlockList(user);
  const {openTipHistory} = useTipHistory();

  const [reported, setReported] = useState<Comment | null>(null);
  const [tippedComment, setTippedComment] = useState<Comment | null>(null);
  const [tippedContentForHistory, setTippedContentForHistory] = useState<Comment | null>(null);
  const [openSuccessPrompt, setOpenSuccessPrompt] = useState(false);

  const sendTipOpened = Boolean(tippedComment);

  useEffect(() => {
    loadAllBlockedUsers();
    loadUsers();
  }, []);

  useEffect(() => {
    if (isTipSent) {
      closeSendTip();
    }
  }, [isTipSent]);

  useEffect(() => {
    loadInitComment(section);
  }, [referenceId]);

  const handleSubmitComment = (comment: Partial<CommentProps>) => {
    if (user) {
      reply(
        user,
        {
          ...comment,
          postId: referenceId,
          referenceId: comment.referenceId ?? referenceId,
          type: comment.type ?? ReferenceType.POST,
          userId: user.id,
          section: comment.section ?? section,
        } as CommentProps,
        () => {
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
        },
      );
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

  const handleSendTip = (reference: Post | Comment) => {
    // type guard to check if reference is a Comment object
    if ('section' in reference) {
      setTippedComment(reference);
      dispatch(setTippedUserId(reference.userId));
      dispatch(setTippedUser(reference.user.name, reference.user.profilePictureURL ?? ''));
    }
  };

  const showConfirmDeleteDialog = (comment: Comment): void => {
    confirm({
      title: 'Delete Comment',
      description: 'Are you sure to remove this comment?',
      icon: 'danger',
      confirmationText: 'Yes, proceed to delete',
      cancellationText: 'No, let me rethink',
      onConfirm: () => {
        remove(comment);
      },
    });
  };

  const closeSendTip = () => {
    if (isTipSent && tippedComment) {
      setOpenSuccessPrompt(true);
      setTippedContentForHistory(tippedComment);
    } else {
      console.log('no comment tipped');
    }
    setTippedComment(null);
  };

  const handleCloseSuccessPrompt = (): void => {
    setOpenSuccessPrompt(false);
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
        onSendTip={handleSendTip}
        onOpenTipHistory={openTipHistory}
        onSearchPeople={handleSearchPeople}
        onDelete={showConfirmDeleteDialog}
        scrollToPost={scrollToPost}
      />

      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Finding this post is insightful? Send a tip!">
        <SendTipContainer />
      </Modal>

      <PromptComponent
        icon={'success'}
        open={openSuccessPrompt}
        onCancel={handleCloseSuccessPrompt}
        title={'Success'}
        subtitle={
          <Typography component="div">
            Tip to{' '}
            <Box fontWeight={400} display="inline">
              {tippedContentForHistory?.user.name ?? 'Unknown Myrian'}
            </Box>{' '}
            sent successfully
          </Typography>
        }>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <a
            target="_blank"
            style={{textDecoration: 'none'}}
            href={explorerURL ?? 'https://myriad.social'}
            rel="noopener noreferrer">
            <Button style={{marginRight: '12px'}} size="small" variant="outlined" color="secondary">
              Transaction details
            </Button>
          </a>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleCloseSuccessPrompt}>
            Return
          </Button>
        </div>
      </PromptComponent>

      <TipHistoryContainer onSendTip={handleSendTip} />

      <ReportContainer reference={reported} onClose={closeReportPost} />
    </>
  );
};

export default CommentListContainer;
