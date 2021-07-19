import { ConfigReducer } from './config/reducer';
import { FriendReducer } from './friend/reducer';
import { NotificationReducer } from './notification/reducer';
import { PopularReducer } from './popular/reducer';
import { TimelineReducer } from './timeline/reducer';
import { UserReducer } from './user/reducer';

import { combineReducers } from 'redux';

const reducers = {
  configState: ConfigReducer,
  friendState: FriendReducer,
  notificationState: NotificationReducer,
  popularState: PopularReducer,
  timelineState: TimelineReducer,
  userState: UserReducer
};

export const combinedReducers = combineReducers(reducers);

export type RootState = ReturnType<typeof combinedReducers>;
