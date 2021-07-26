import {RootState} from '../reducers';

import {Action, ActionCreator, AnyAction} from 'redux';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';

export type ThunkActionCreator<A extends Action, S = void> = ActionCreator<
  ThunkAction<void, S, void, A>
>;

export type ThunkDispatchAction = ThunkDispatch<RootState, void, AnyAction>;
