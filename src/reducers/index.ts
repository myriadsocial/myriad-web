import {ConfigReducer} from './config/reducer';
import {FriendReducer} from './friend/reducer';
import {NotificationReducer} from './notification/reducer';
import {PopularReducer} from './popular/reducer';
import {ProfileReducer} from './profile/reducer';
import {TimelineReducer} from './timeline/reducer';
import {TipSummaryReducer} from './tip-summary/reducer';
import {UserReducer} from './user/reducer';

import {combineReducers} from 'redux';

const reducers = {
  configState: ConfigReducer,
  friendState: FriendReducer,
  notificationState: NotificationReducer,
  popularState: PopularReducer,
  profileState: ProfileReducer,
  timelineState: TimelineReducer,
  userState: UserReducer,
  tipSummaryState: TipSummaryReducer,
};

export const combinedReducers = combineReducers(reducers);

export type RootState = ReturnType<typeof combinedReducers>;
