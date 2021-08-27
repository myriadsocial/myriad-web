//TODO: migrate to redux, src/reducers/experience
import React from 'react';

import {Experience} from 'src/interfaces/experience';
import {People} from 'src/interfaces/people';

export enum ExperienceActionType {
  INIT_EXPERIENCE = 'INIT_EXPERIENCE',
  SHOW_MORE_EXPERIENCE = 'SHOW_MORE_EXPERIENCE',
  SEARCH_EXPERIENCE = 'SEARCH_EXPERIENCE',
  SELECT_EXPERIENCE = 'SELECT_EXPERIENCE',
  UPDATE_SELECTED_EXPERIENCE = 'UPDATE_SELECTED_EXPERIENCE',
  EDIT_EXPERIENCE = 'EDIT_EXPERIENCE',
  ADD_EXPERIENCE = 'ADD_EXPERIENCE',
  REMOVE_EXPERIENCE = 'REMOVE_EXPERIENCE',
  ADD_TO_HIDDEN = 'ADD_TO_HIDDEN',
  REMOVE_FROM_HIDDEN = 'REMOVE_FROM_HIDDEN',
}

export interface InitExperience {
  type: ExperienceActionType.INIT_EXPERIENCE;
  experiences: Experience[];
}

export interface ShowMoreExperience {
  type: ExperienceActionType.SHOW_MORE_EXPERIENCE;
  experiences: Experience[];
}

export interface SearchExperience {
  type: ExperienceActionType.SEARCH_EXPERIENCE;
  experiences: Experience[];
}

export interface SelectExperience {
  type: ExperienceActionType.SELECT_EXPERIENCE;
  experience: Experience;
}

export interface UpdateSelectedExperience {
  type: ExperienceActionType.UPDATE_SELECTED_EXPERIENCE;
  experience: Experience;
}

export interface EditExperience {
  type: ExperienceActionType.EDIT_EXPERIENCE;
  experience_id: string;
  experience: Experience;
}

export interface AddExperience {
  type: ExperienceActionType.ADD_EXPERIENCE;
  payload: Experience;
}

export interface RemoveExperience {
  type: ExperienceActionType.REMOVE_EXPERIENCE;
  experience_id: string;
}

export interface addToHidden {
  type: ExperienceActionType.ADD_TO_HIDDEN;
  people: People[];
  tags: string[];
}

export interface removeFromHidden {
  type: ExperienceActionType.REMOVE_FROM_HIDDEN;
  people: People[];
  tags: string[];
}

export interface RemoveExperience {
  type: ExperienceActionType.REMOVE_EXPERIENCE;
  experience_id: string;
}

export type Action =
  | InitExperience
  | ShowMoreExperience
  | SearchExperience
  | SelectExperience
  | UpdateSelectedExperience
  | EditExperience
  | AddExperience
  | RemoveExperience
  | addToHidden
  | removeFromHidden;
type Dispatch = (action: Action) => void;
type ExperienceProviderProps = {children: React.ReactNode};
type State = {
  init: boolean;
  experiences: Experience[];
  selected: Experience | null;
  edit: Experience | null;
  searched: Experience[];
  hiddenPeople: People[];
  hiddenTags: string[];
};

const initalState = {
  init: true,
  selected: null,
  edit: null,
  experiences: [],
  searched: [],
  hiddenPeople: [],
  hiddenTags: [],
};

const ExperienceContext = React.createContext<{state: State; dispatch: Dispatch} | undefined>(
  undefined,
);

function experienceReducer(state: State, action: Action) {
  switch (action.type) {
    case ExperienceActionType.INIT_EXPERIENCE: {
      return {
        ...state,
        experiences: action.experiences,
        selected: action.experiences[0],
        init: false,
      };
    }

    case ExperienceActionType.ADD_EXPERIENCE: {
      return {
        ...state,
        selected: action.payload,
        experiences: [action.payload, ...state.experiences],
      };
    }

    case ExperienceActionType.SELECT_EXPERIENCE: {
      return {
        ...state,
        selected: action.experience,
      };
    }

    case ExperienceActionType.UPDATE_SELECTED_EXPERIENCE: {
      return {
        ...state,
        selected: {
          ...state.selected,
          ...action.experience,
        },
      };
    }

    case ExperienceActionType.EDIT_EXPERIENCE: {
      return {
        ...state,
        edit: action.experience,
      };
    }

    case ExperienceActionType.REMOVE_EXPERIENCE: {
      return {
        ...state,
        experiences: state.experiences.filter(item => item.id !== action.experience_id),
      };
    }

    case ExperienceActionType.SEARCH_EXPERIENCE: {
      return {
        ...state,
        searched: [...action.experiences, ...state.searched],
      };
    }

    case ExperienceActionType.SHOW_MORE_EXPERIENCE: {
      return {
        ...state,
        experiences: [...action.experiences, ...state.experiences],
      };
    }

    case ExperienceActionType.ADD_TO_HIDDEN: {
      return {
        ...state,
        hiddenPeople: [...state.hiddenPeople, ...action.people],
        hiddenTags: [...state.hiddenTags, ...action.tags],
      };
    }

    case ExperienceActionType.REMOVE_FROM_HIDDEN: {
      return {
        ...state,
        hiddenPeople: state.hiddenPeople.filter(
          item => !action.people.map(people => people.id).includes(item.id),
        ),
        hiddenTags: state.hiddenTags.filter(item => !action.tags.includes(item)),
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

export const ExperienceProvider = ({children}: ExperienceProviderProps) => {
  const [state, dispatch] = React.useReducer(experienceReducer, initalState);
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {state, dispatch};

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
};
