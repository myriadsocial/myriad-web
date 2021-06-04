import React from 'react';

import { ExtendedNotification } from 'src/interfaces/notification';

export enum NotifActionType {
  LOAD_NOTIF = 'LOAD_NOTIF'
}

interface LoadNotif {
  type: NotifActionType.LOAD_NOTIF;
  payload: ExtendedNotification[];
}

type Action = LoadNotif;
type Dispatch = (action: Action) => void;
type NotifProviderProps = { children: React.ReactNode };

type State = {
  notifications: ExtendedNotification[];
};

const initialState: State = {
  notifications: []
};

const NotifContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function notificationReducer(state: State, action: Action) {
  switch (action.type) {
    case NotifActionType.LOAD_NOTIF: {
      return {
        ...state,
        notifications: action.payload
      };
    }
    default: {
      throw new Error('Unhandled action type');
    }
  }
}

export const useNotif = () => {
  const context = React.useContext(NotifContext);

  if (context === undefined) {
    throw new Error('useNotif must be used within a NotifProvider');
  }

  return context;
};

export const NotifProvider = ({ children }: NotifProviderProps) => {
  const [state, dispatch] = React.useReducer(notificationReducer, initialState);
  const value = { state, dispatch };

  return <NotifContext.Provider value={value}>{children}</NotifContext.Provider>;
};
