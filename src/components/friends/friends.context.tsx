import React from 'react';

import { ExtendedFriend } from 'src/interfaces/friend';

export enum FriendsActionType {
  LOAD_FRIENDS = 'LOAD_FRIENDS',
  LOAD_FRIEND_REQUESTS = 'LOAD_FRIEND_REQUESTS',
  ADD_FRIEND = 'ADD_FRIEND',
  APPROVE_FRIEND = 'APPROVE_FRIEND',
  REJECT_FRIEND = 'REJECT_FRIEND'
}

interface LoadFriends {
  type: FriendsActionType.LOAD_FRIENDS;
  payload: ExtendedFriend[];
}

interface LoadFriendRequests {
  type: FriendsActionType.LOAD_FRIEND_REQUESTS;
  payload: ExtendedFriend[];
}

type Action = LoadFriends | LoadFriendRequests;
type Dispatch = (action: Action) => void;
type FriendsProviderProps = { children: React.ReactNode };

type State = {
  friends: ExtendedFriend[];
  requests: ExtendedFriend[];
};

const initalState: State = {
  friends: [],
  requests: []
};

const FriendsContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function conversationReducer(state: State, action: Action) {
  switch (action.type) {
    case FriendsActionType.LOAD_FRIENDS: {
      return {
        ...state,
        friends: action.payload
      };
    }

    case FriendsActionType.LOAD_FRIEND_REQUESTS: {
      return {
        ...state,
        requests: action.payload
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

export const useFriends = () => {
  const context = React.useContext(FriendsContext);

  if (context === undefined) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }

  return context;
};

export const FriendsProvider = ({ children }: FriendsProviderProps) => {
  const [state, dispatch] = React.useReducer(conversationReducer, initalState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };

  return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>;
};
