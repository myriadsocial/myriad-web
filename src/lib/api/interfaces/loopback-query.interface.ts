type LoopbackJoinConditionOperator = 'and' | 'or';

export type LoopbackWhere<T> = Partial<Record<keyof T, any>> &
  Partial<Record<LoopbackJoinConditionOperator, any>> &
  any;
