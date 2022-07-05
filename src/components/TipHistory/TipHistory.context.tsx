import {Context, createContext} from 'react';

import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

export type HandleTipHistory = {
  reference: Post | Comment | User | null;
  open: (reference: Post | Comment | User) => void;
};

const defaultContext: HandleTipHistory = {
  reference: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  open: reference => {},
};

export const TipHistoryContext: Context<HandleTipHistory> = createContext(defaultContext);
