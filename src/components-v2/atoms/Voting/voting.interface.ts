export type VoteProps = {
  variant?: 'row' | 'column';
  vote: number;
  size?: 'small' | 'medium';
  isDownVote: boolean;
  isUpVote: boolean;
  onUpvote: () => void;
  onDownVote: () => void;
  disabled?: boolean;
};
