import {BalanceReducer} from './balance/reducer';
import {BaseReducer} from './base/reducer';
import {ConfigReducer} from './config/reducer';
import {FriendReducer} from './friend/reducer';
import {NotificationReducer} from './notification/reducer';
import {PopularReducer} from './popular/reducer';
import {ProfileReducer} from './profile/reducer';
import {TimelineReducer} from './timeline/reducer';
import {TipSummaryReducer} from './tip-summary/reducer';
import {UserReducer} from './user/reducer';
import {WalletReducer} from './wallet/reducer';

import {combineReducers} from 'redux';

const reducers = {
  baseState: BaseReducer,
  configState: ConfigReducer,
  friendState: FriendReducer,
  notificationState: NotificationReducer,
  popularState: PopularReducer,
  profileState: ProfileReducer,
  timelineState: TimelineReducer,
  userState: UserReducer,
  tipSummaryState: TipSummaryReducer,
  balanceState: BalanceReducer,
  walletState: WalletReducer,
};

export const combinedReducers = combineReducers(reducers);

export type RootState = ReturnType<typeof combinedReducers>;
