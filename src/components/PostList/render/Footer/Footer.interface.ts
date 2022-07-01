import {VoteActionProps} from 'components/atoms/Voting/voting.interface';
import {PostMetric} from 'src/interfaces/post';

export type PostFooterActionProps = VoteActionProps & {
  onShare: () => void;
  onShowComments: () => void;
};

export type PostFooterProps = PostFooterActionProps & {
  postId: string;
  metrics: PostMetric;
  downvoted?: boolean;
  upvoted?: boolean;
};
