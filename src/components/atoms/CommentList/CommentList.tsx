import React, {createRef, useEffect} from 'react';

import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {CommentDetail} from '../CommentDetail';

import {FriendDetail} from 'src/components/FriendsMenu/hooks/use-friend-list.hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {Comment, CommentProps} from 'src/interfaces/comment';
import {SectionType} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';

type CommentListProps = {
  section: SectionType;
  user?: User;
  comments: Comment[];
  mentionables: FriendDetail[];
  deep?: number;
  placeholder?: string;
  focus?: boolean;
  expand?: boolean;
  hasMoreReplies?: boolean;
  onComment: (comment: Partial<CommentProps>) => void;
  onUpvote: (comment: Comment) => void;
  onRemoveVote: (comment: Comment) => void;
  onLoadReplies: (referenceId: string, deep: number) => void;
  onOpenTipHistory: (comment: Comment) => void;
  onSendTip: (comment: Comment) => void;
  onReport: (comment: Comment) => void;
  onSearchPeople: (query: string) => void;
  setDownvoting: (comment: Comment) => void;
  onBeforeDownvote?: () => void;
  onCommentReplies?: (comment: Partial<CommentProps>) => void;
  onLoadMoreReplies?: () => void;
  onUpvoteReplies?: (replies: Comment) => void;
  onRemoveVoteReplies?: (replies: Comment) => void;
  setDownvotingReplies?: (replies: Comment) => void;
  onReportReplies?: (replies: Comment) => void;
  onSendTipReplies?: (replies: Comment) => void;
};

type refComment = Record<any, React.RefObject<HTMLDivElement>>;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
  }),
);

export const CommentList: React.FC<CommentListProps> = props => {
  const {
    section,
    user,
    comments = [],
    mentionables,
    deep = 0,
    hasMoreReplies = false,
    onComment,
    onUpvote,
    onRemoveVote,
    onLoadReplies,
    onOpenTipHistory,
    onReport,
    onSendTip,
    onSearchPeople,
    setDownvoting,
    onBeforeDownvote,
    onLoadMoreReplies,
    onCommentReplies = () => {},
    onUpvoteReplies = () => {},
    onRemoveVoteReplies = () => {},
    setDownvotingReplies = () => {},
    onReportReplies = () => {},
    onSendTipReplies = () => {}
  } = props;
  const {query} = useQueryParams();

  const styles = useStyles();

  let refs: any = comments.reduce((acc: refComment, value: any) => {
    acc[value.id] = createRef<HTMLDivElement>();
    return acc;
  }, {});

  useEffect(() => {
    if (Object.keys(refs).length > 0) {
      if (!Array.isArray(query.comment) && query.comment) {
        if (refs[query.comment]?.current) {
          refs[query.comment].current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    }

    () => {
      refs = {};
    };
  }, [refs]);

  return (
    <div className={styles.root}>
      {comments.map(comment => (
        <CommentDetail
          ref={refs[comment.id]}
          section={section}
          user={user}
          key={comment.id}
          comment={comment}
          mentionables={mentionables}
          deep={deep}
          onReply={deep === 0 ? onComment : onCommentReplies}
          onUpvote={deep === 0 ? onUpvote : onUpvoteReplies}
          onRemoveVote={deep === 0 ? onRemoveVote : onRemoveVoteReplies}
          onLoadReplies={onLoadReplies}
          onOpenTipHistory={onOpenTipHistory}
          onReport={deep === 0 ? onReport : onReportReplies}
          onSendTip={deep === 0 ? onSendTip : onSendTipReplies}
          onSearchPeople={onSearchPeople}
          setDownvoting={deep === 0 ? setDownvoting : setDownvotingReplies}
          onBeforeDownvote={onBeforeDownvote}
        />
      ))}
      {
        comments.length > 0 && deep > 0 && 
        hasMoreReplies &&
        <div style={{marginLeft: '69px', cursor: 'pointer'}} onClick={onLoadMoreReplies}>
          <Typography color="primary">View more replies</Typography>
        </div>
      }
    </div>
  );
};
