import React from 'react';

import {SocialsEnum} from 'src/interfaces/index';
import {LayoutFilterType} from 'src/interfaces/setting';
import {SidebarTab} from 'src/interfaces/sidebar';

export enum LayoutSettingActionType {
  TOGGLE_FOCUS = 'TOGGLE_FOCUS',
  CHANGE_SETTING = 'CHANGE_SETTING',
  CHANGE_SELECTED_SIDEBAR = 'CHANGE_SELECTED_SIDEBAR',
}

interface ToggleFocus {
  type: LayoutSettingActionType.TOGGLE_FOCUS;
}

interface ChageSetting {
  type: LayoutSettingActionType.CHANGE_SETTING;
  key: LayoutFilterType | SocialsEnum;
  value: boolean;
}

interface ChageSelectedSidebar {
  type: LayoutSettingActionType.CHANGE_SELECTED_SIDEBAR;
  value: SidebarTab;
}

type Action = ToggleFocus | ChageSetting | ChageSelectedSidebar;
type Dispatch = (action: Action) => void;
type LayoutSettingProviderProps = {children: React.ReactNode};

type State = Record<LayoutFilterType, boolean> &
  Record<SocialsEnum, boolean> & {
    selectedSidebarMenu: SidebarTab;
  };

const initalState: State = {
  focus: false,
  topic: true,
  people: true,
  [SocialsEnum.FACEBOOK]: true,
  [SocialsEnum.REDDIT]: true,
  [SocialsEnum.TWITTER]: true,
  [SocialsEnum.TELEGRAM]: true,
  selectedSidebarMenu: SidebarTab.FRIENDS,
};

const LayoutSettingContext = React.createContext<{state: State; dispatch: Dispatch} | undefined>(
  undefined,
);

function layoutSettingReducer(state: State, action: Action) {
  switch (action.type) {
    case LayoutSettingActionType.CHANGE_SETTING: {
      return {
        ...state,
        [action.key]: action.value,
      };
    }
    case LayoutSettingActionType.TOGGLE_FOCUS: {
      return {
        ...state,
        focus: !state.focus,
      };
    }
    case LayoutSettingActionType.CHANGE_SELECTED_SIDEBAR: {
      return {
        ...state,
        selectedSidebarMenu: action.value,
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

export const LayoutSettingProvider = ({children}: LayoutSettingProviderProps) => {
  const [state, dispatch] = React.useReducer(layoutSettingReducer, initalState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {state, dispatch};

  return <LayoutSettingContext.Provider value={value}>{children}</LayoutSettingContext.Provider>;
};
