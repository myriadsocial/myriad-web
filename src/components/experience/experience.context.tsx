import React from 'react';

import { Experience } from 'src/interfaces/experience';

export enum ExperienceActionType {
  INIT_EXPERIENCE = 'INIT_EXPERIENCE',
  SHOW_MORE_EXPERIENCE = 'SHOW_MORE_EXPERIENCE',
  SELECT_EXPERIENCE = 'SELECT_EXPERIENCE',
  EDIT_EXPERIENCE = 'EDIT_EXPERIENCE',
  ADD_EXPERIENCE = 'ADD_EXPERIENCE',
  REMOVE_EXPERIENCE = 'REMOVE_EXPERIENCE'
}

export interface InitExperience {
  type: ExperienceActionType.INIT_EXPERIENCE;
  experiences: Experience[];
}

interface ShowMoreExperience {
  type: ExperienceActionType.SHOW_MORE_EXPERIENCE;
  experiences: Experience[];
}

interface SelectExperience {
  type: ExperienceActionType.SELECT_EXPERIENCE;
  experience: Experience;
}

interface EditExperience {
  type: ExperienceActionType.EDIT_EXPERIENCE;
  experience_id: string;
  experience: Experience;
}

interface AddExperience {
  type: ExperienceActionType.ADD_EXPERIENCE;
  payload: Experience;
}

interface RemoveExperience {
  type: ExperienceActionType.REMOVE_EXPERIENCE;
  experience_id: string;
}

export type Action = InitExperience | ShowMoreExperience | SelectExperience | EditExperience | AddExperience | RemoveExperience;
type Dispatch = (action: Action) => void;
type ExperienceProviderProps = { children: React.ReactNode };
type State = {
  experiences: Experience[];
  selected: Experience | null;
  edit: Experience | null;
};

const initalState = {
  selected: null,
  edit: null,
  experiences: []
};

const ExperienceContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function experienceReducer(state: State, action: Action) {
  switch (action.type) {
    case ExperienceActionType.INIT_EXPERIENCE: {
      return {
        ...state,
        experiences: action.experiences
      };
    }

    case ExperienceActionType.ADD_EXPERIENCE: {
      return {
        ...state,
        selected: action.payload,
        experiences: [action.payload, ...state.experiences]
      };
    }

    case ExperienceActionType.SELECT_EXPERIENCE: {
      return {
        ...state,
        selected: action.experience
      };
    }

    case ExperienceActionType.EDIT_EXPERIENCE: {
      return {
        ...state,
        edit: action.experience
      };
    }

    case ExperienceActionType.REMOVE_EXPERIENCE: {
      return {
        ...state,
        experiences: state.experiences.filter(item => item.id !== action.experience_id)
      };
    }

    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

export const useExperience = () => {
  const context = React.useContext(ExperienceContext);

  if (context === undefined) {
    throw new Error('useExperience must be used within a ExperienceProvider');
  }

  return context;
};

export const ExperienceProvider = ({ children }: ExperienceProviderProps) => {
  const [state, dispatch] = React.useReducer(experienceReducer, initalState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
};
