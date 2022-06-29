import {Context, createContext} from 'react';

import {Actions} from './Authorization.interface';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const defaultContext: Actions = {
  authorized: false,
  alert: noop,
};

export const AuthorizationContext: Context<Actions> = createContext(defaultContext);
