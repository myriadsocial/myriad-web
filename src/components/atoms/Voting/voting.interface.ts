export type VoteActionProps = {
  onUpvote: () => void;
  onDownVote: () => void;
};

export type VoteProps = VoteActionProps & {
  variant?: 'row' | 'column';
  vote: number;
  size?: 'small' | 'medium';
  isDownVoted: boolean;
  isUpVoted: boolean;
  disabled?: boolean;
};
