import {configureStore, combineReducers} from '@reduxjs/toolkit';
import type {PreloadedState} from '@reduxjs/toolkit';

import {BalanceReducer} from './balance/reducer';
import {BaseReducer} from './base/reducer';
import {BlockReducer} from './block/reducer';
import {CommentReducer} from './comment/reducer';
import {ConfigReducer} from './config/reducer';
import {ExchangeRateReducer} from './exchange-rate/reducer';
import {ExperienceReducer} from './experience/reducer';
import {FriendRequestReducer} from './friend-request/reducer';
import {FriendReducer} from './friend/reducer';
import {ImporterReducer} from './importers/reducer';
import {NotificationReducer} from './notification/reducer';
import {PeopleReducer} from './people/reducer';
import {ProfileReducer} from './profile/reducer';
import {SearchReducer} from './search/reducer';
import {TagReducer} from './tag/reducer';
import {TimelineReducer} from './timeline/reducer';
import {TipSummaryReducer} from './tip-summary/reducer';
import {TransactionReducer} from './transaction/reducer';
import {UserReducer} from './user/reducer';

const reducers = {
  baseState: BaseReducer,
  commentState: CommentReducer,
  configState: ConfigReducer,
  friendState: FriendReducer,
  friendRequestState: FriendRequestReducer,
  notificationState: NotificationReducer,
  tagState: TagReducer,
  profileState: ProfileReducer,
  timelineState: TimelineReducer,
  userState: UserReducer,
  tipSummaryState: TipSummaryReducer,
  balanceState: BalanceReducer,
  transactionState: TransactionReducer,
  experienceState: ExperienceReducer,
  peopleState: PeopleReducer,
  exchangeRateState: ExchangeRateReducer,
  importersState: ImporterReducer,
  blockState: BlockReducer,
  searchState: SearchReducer,
};

export const combinedReducers = combineReducers(reducers);

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: combinedReducers,
    preloadedState,
  });
};

export type RootState = ReturnType<typeof combinedReducers>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
