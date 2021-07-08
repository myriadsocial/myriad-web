import React from 'react';

import { ExtendedFriend } from 'src/interfaces/friend';
import { Post } from 'src/interfaces/post';
import { ExtendedUserPost } from 'src/interfaces/user';

export enum ProfileActionType {
  FETCH_PROFILE = 'FETCH_PROFILE',
  PROFILE_LOADED = 'PROFILE_LOADED',
  IMPORTEDPOST_LOADED = 'IMPORTEDPOST_LOADED',
  FRIEND_STATUS = 'FRIEND_STATUS',
  LOAD_FRIENDS = 'LOAD_FRIENDS'
}

interface ProfileLoaded {
  type: ProfileActionType.PROFILE_LOADED;
  payload: ExtendedUserPost;
}

interface ImportedPostLoaded {
  type: ProfileActionType.IMPORTEDPOST_LOADED;
  payload: Post[];
}

interface FetchProfile {
  type: ProfileActionType.FETCH_PROFILE;
}

interface CheckFriendStatus {
  type: ProfileActionType.FRIEND_STATUS;
  payload: ExtendedFriend;
}

interface LoadFriends {
  type: ProfileActionType.LOAD_FRIENDS;
  payload: ExtendedFriend[];
}

type Action = ProfileLoaded | FetchProfile | ImportedPostLoaded | CheckFriendStatus | LoadFriends;
type Dispatch = (action: Action) => void;
type ProfileProviderProps = { children: React.ReactNode };

type State = {
  profile: ExtendedUserPost | null;
  loading: boolean;
  importedPost: Post[];
  friendStatus: ExtendedFriend | null;
  friends: ExtendedFriend[];
  totalFriends: number;
};

const initalState = {
  loading: false,
  profile: null,
  importedPost: [],
  friendStatus: null,
  friends: [],
  totalFriends: 0
};

const ProfileContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function profileReducer(state: State, action: Action) {
  switch (action.type) {
    case ProfileActionType.PROFILE_LOADED: {
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    }
    case ProfileActionType.IMPORTEDPOST_LOADED: {
      return {
        ...state,
        importedPost: action.payload,
        loading: false
      };
    }
    case ProfileActionType.FRIEND_STATUS: {
      return {
        ...state,
        friendStatus: action.payload,
        loading: false
      };
    }
    case ProfileActionType.FETCH_PROFILE: {
      return {
        ...state,
        loading: true
      };
    }
    case ProfileActionType.LOAD_FRIENDS: {
      return {
        ...state,
        friends: action.payload,
        totalFriends: action.payload.length
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

export const useProfile = () => {
  const context = React.useContext(ProfileContext);

  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }

  return context;
};

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const [state, dispatch] = React.useReducer(profileReducer, initalState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
