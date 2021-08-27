import {useState, useEffect} from 'react';

import {useExperience as baseUseExperience, ExperienceActionType} from './experience.context';

import {Tag, LayoutType} from 'src/interfaces/experience';
import {People} from 'src/interfaces/people';

//TODO: move this file to hooks/use-experience.hook and migrate to redux
export const useSelectedExperience = (userId: string) => {
  const {state, dispatch} = baseUseExperience();
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    setEdited(false);
  }, [state.selected?.id]);

  const changeSelectedLayout = (type: LayoutType) => {
    if (!state.selected) {
      return;
    }

    dispatch({
      type: ExperienceActionType.UPDATE_SELECTED_EXPERIENCE,
      experience: {
        ...state.selected,
        layout: type,
      },
    });

    setEdited(true);
  };

  const addPeopleToExperience = (people: People) => {
    if (!state.selected) {
      return;
    }

    dispatch({
      type: ExperienceActionType.UPDATE_SELECTED_EXPERIENCE,
      experience: {
        ...state.selected,
        people: [...state.selected.people, people],
      },
    });

    setEdited(true);
  };

  const removePeopleFromExperience = (people: People) => {
    if (!state.selected) {
      return;
    }

    dispatch({
      type: ExperienceActionType.UPDATE_SELECTED_EXPERIENCE,
      experience: {
        ...state.selected,
        people: state.selected.people.filter(item => item.id !== people.id),
      },
    });

    setEdited(true);
  };

  const addTopicToExperience = (tag: Tag) => {
    if (!state.selected) {
      return;
    }

    dispatch({
      type: ExperienceActionType.UPDATE_SELECTED_EXPERIENCE,
      experience: {
        ...state.selected,
        tags: [...state.selected.tags, tag],
      },
    });

    setEdited(true);
  };

  const removeTopicFromExperience = (tag: Tag) => {
    if (!state.selected) {
      return;
    }

    dispatch({
      type: ExperienceActionType.UPDATE_SELECTED_EXPERIENCE,
      experience: {
        ...state.selected,
        tags: state.selected.tags.filter(item => item.id !== tag.id),
      },
    });

    setEdited(true);
  };

  return {
    edited,
    selectedExperience: state.selected,
    addPeopleToExperience,
    removePeopleFromExperience,
    addTopicToExperience,
    removeTopicFromExperience,
    changeSelectedLayout,
  };
};
