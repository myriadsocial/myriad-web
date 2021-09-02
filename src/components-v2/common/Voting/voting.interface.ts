export type VoteProps = {
  variant?: 'type1' | 'type2';
};

enum VoteType {
  TYPE1 = 'type1',
  TYPE2 = 'type2',
}

type VoteTypeKey = keyof typeof VoteType;
type VoteTypeValues = typeof VoteType[VoteTypeKey];
export const voteType: VoteTypeValues[] = Object.values(VoteType);
