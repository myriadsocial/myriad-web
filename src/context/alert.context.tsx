import React from 'react';

import {Color} from '@material-ui/lab/Alert';

import {ErrorProp} from 'src/interfaces/error';

export enum AlertActionType {
  SET_ALERT = 'SET_ALERT',
  SET_TIP_ALERT = 'SET_TIP_ALERT',
  CLEAR_ALERT = 'CLEAR_ALERT',
}

interface SetAlert {
  type: AlertActionType.SET_ALERT;
  payload: ErrorProp;
}

interface SetTipAlert {
  type: AlertActionType.SET_TIP_ALERT;
  payload: ErrorProp;
}

interface ClearAlert {
  type: AlertActionType.CLEAR_ALERT;
}

type Action = SetAlert | SetTipAlert | ClearAlert;
type Dispatch = (action: Action) => void;
type AlertProviderProps = {children: React.ReactNode};

type State = {
  isTipping: boolean;
  open: boolean;
  title: string | null;
  message: string | null;
  severity: Color | null;
};

const initalState: State = {
  isTipping: false,
  open: false,
  title: null,
  message: null,
  severity: null,
};

const AlertContext = React.createContext<{state: State; dispatch: Dispatch} | undefined>(undefined);

function errorReducer(state: State, action: Action) {
  switch (action.type) {
    case AlertActionType.SET_TIP_ALERT: {
      return {
        ...state,
        ...action.payload,
        isTipping: true,
      };
    }
    case AlertActionType.SET_ALERT: {
      return {
        ...state,
        ...action.payload,
        open: true,
      };
    }
    case AlertActionType.CLEAR_ALERT: {
      return initalState;
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

export const useAlert = () => {
  const context = React.useContext(AlertContext);

  if (context === undefined) {
    throw new Error('useAlert must be used within a AlertProvider');
  }

  return context;
};

export const AlertProvider = ({children}: AlertProviderProps) => {
  const [state, dispatch] = React.useReducer(errorReducer, initalState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {state, dispatch};

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};
