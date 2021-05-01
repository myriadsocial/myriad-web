import React from 'react';

import { LayoutFilterType } from 'src/interfaces/setting';

export enum LayoutSettingActionType {
  TOGGLE_FOCUS = 'TOGGLE_FOCUS',
  CHANGE_SETTING = 'CHANGE_SETTING'
}

interface ToggleFocus {
  type: LayoutSettingActionType.TOGGLE_FOCUS;
}

interface ChageSetting {
  type: LayoutSettingActionType.CHANGE_SETTING;
  key: LayoutFilterType;
  value: boolean;
}

type Action = ToggleFocus | ChageSetting;
type Dispatch = (action: Action) => void;
type LayoutSettingProviderProps = { children: React.ReactNode };

type State = Record<LayoutFilterType, boolean>;

const initalState = {
  focus: false,
  topic: true,
  people: true
};

const LayoutSettingContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function layoutSettingReducer(state: State, action: Action) {
  switch (action.type) {
    case LayoutSettingActionType.CHANGE_SETTING: {
      return {
        ...state,
        [action.key]: action.value
      };
    }
    case LayoutSettingActionType.TOGGLE_FOCUS: {
      return {
        ...state,
        focus: !state.focus
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

export const useLayoutSetting = () => {
  const context = React.useContext(LayoutSettingContext);

  if (context === undefined) {
    throw new Error('useLayoutSetting must be used within a LayoutSettingProvider');
  }

  return context;
};

export const LayoutSettingProvider = ({ children }: LayoutSettingProviderProps) => {
  const [state, dispatch] = React.useReducer(layoutSettingReducer, initalState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };

  return <LayoutSettingContext.Provider value={value}>{children}</LayoutSettingContext.Provider>;
};
