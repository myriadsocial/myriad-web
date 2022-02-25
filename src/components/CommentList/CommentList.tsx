import React, {createRef, useEffect} from 'react';

import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {CommentDetail} from '../CommentDetail';

import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {Comment} from 'src/interfaces/comment';
import {SectionType, Vote} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';

type CommentListProps = {
  section: SectionType;
  user?: User;
  comments: Comment[];
  mentionables: User[];
  blockedUserIds: string[];
  deep?: number;
  placeholder?: string;
  focus?: boolean;
  expand?: boolean;
  hasMoreComment: boolean;
  onLoadMoreReplies: () => void;
  onUpvote: (comment: Comment) => void;
  onRemoveVote: (comment: Comment) => void;
  onUpdateDownvote: (commentId: string, total: number, vote: Vote) => void;
  onOpenTipHistory: (comment: Comment) => void;
  onSendTip: (comment: Comment) => void;
  onReport: (comment: Comment) => void;
  onSearchPeople: (query: string) => void;
  onBeforeDownvote?: () => void;
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
    blockedUserIds,
    deep = 0,
    hasMoreComment = false,
    onUpvote,
    onRemoveVote,
    onUpdateDownvote,
    onOpenTipHistory,
    onReport,
    onSendTip,
    onSearchPeople,
    onBeforeDownvote,
    onLoadMoreReplies,
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
          blockedUserIds={blockedUserIds}
          deep={deep}
          onUpvote={onUpvote}
          onRemoveVote={onRemoveVote}
          onUpdateDownvote={onUpdateDownvote}
          onOpenTipHistory={onOpenTipHistory}
          onReport={onReport}
          onSendTip={onSendTip}
          onSearchPeople={onSearchPeople}
          onBeforeDownvote={onBeforeDownvote}
        />
      ))}

      {comments.length > 0 && deep > 0 && hasMoreComment && (
        <div style={{marginLeft: '69px', cursor: 'pointer'}} onClick={onLoadMoreReplies}>
          <Typography color="primary">View more replies</Typography>
        </div>
      )}
    </div>
  );
};
