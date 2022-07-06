import {Context, createContext} from 'react';

import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';

export type HandleReport = {
  reference: Post | Comment | null;
  open: (reference: Post | Comment) => void;
};

const defaultContext: HandleReport = {
  reference: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  open: reference => {},
};

export const ReportContext: Context<HandleReport> = createContext(defaultContext);
