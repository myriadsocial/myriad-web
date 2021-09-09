export type VoteProps = {
  variant?: 'row' | 'column';
  vote: number;
  size?: 'small' | 'medium';
  onUpvote: () => void;
  onDownVote: () => void;
};
