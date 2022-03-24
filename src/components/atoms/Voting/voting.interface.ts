export type VoteProps = {
  variant?: 'row' | 'column';
  vote: number;
  size?: 'small' | 'medium';
  isDownVoted: boolean;
  isUpVoted: boolean;
  onUpvote: () => void;
  onDownVote: () => void;
  disabled?: boolean;
};
