import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import getConfig from 'next/config';

import {useExperience as baseUseExperience, ExperienceActionType} from './experience.context';

import Axios from 'axios';
import {omit} from 'lodash';
import {Experience} from 'src/interfaces/experience';
import {RootState} from 'src/reducers';
import {updateFilter} from 'src/reducers/timeline/actions';
import {TimelineState} from 'src/reducers/timeline/reducer';

const {publicRuntimeConfig} = getConfig();

const axios = Axios.create({
  baseURL: publicRuntimeConfig.apiURL,
});

//TODO: move this file to hooks/use-experience.hook and migrate to redux
export const useExperience = (userId: string) => {
  const {state, dispatch} = baseUseExperience();
  const timelineState = useSelector<RootState, TimelineState>(state => state.timelineState);
  const dispatchThunk = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    offset: 0,
    limit: 10,
    where: {},
    include: ['user'],
  });

  const load = async (type: ExperienceActionType = ExperienceActionType.INIT_EXPERIENCE) => {
    let filter = params;

    //TODO: update when applying address on anonymous
    if (userId !== 'null') {
      filter = {
        ...filter,
        where: {
          userId,
        },
      };
    }

    setLoading(true);

    try {
      const {data} = await axios.request<Experience[]>({
        url: '/experiences',
        method: 'GET',
        params: {
          filter,
        },
      });

      dispatch({
        type: ExperienceActionType.INIT_EXPERIENCE,
        experiences: data.map(experience => {
          return {
            ...experience,
            // @ts-ignore
            layout: experience.layout ? experience.layout : 'timeline',
          };
        }),
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreExperience = async () => {
    const filter = {
      ...params,
      offset: (params.offset + 1) * params.limit,
    };

    setLoading(true);

    try {
      const {data} = await axios.request<Experience[]>({
        url: `/users/${userId}/experiences`,
        method: 'GET',
        params: {
          filter,
        },
      });

      setParams(filter);

      if (data.length > 0) {
        dispatch({
          type: ExperienceActionType.SHOW_MORE_EXPERIENCE,
          experiences: data.map(experience => {
            return {
              ...experience,
              // @ts-ignore
              layout: !experience.layout || experience.layout === '' ? 'timeline' : 'photo',
            };
          }),
        });
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const selectExperience = async (id: string) => {
    const experience = state.experiences.find(item => item.id === id);

    if (experience) {
      dispatch({
        type: ExperienceActionType.SELECT_EXPERIENCE,
        experience,
      });
    }
  };

  const editExperience = async (data: Experience) => {
    dispatch({
      type: ExperienceActionType.EDIT_EXPERIENCE,
      experience_id: data.id,
      experience: data,
    });
  };

  const storeExperience = async (experience: Experience) => {
    const {data} = await axios({
      url: `users/${userId}/experiences`,
      method: 'POST',
      data: omit(experience, ['id', 'user', 'description', 'layout']),
    });

    dispatch({
      type: ExperienceActionType.ADD_EXPERIENCE,
      payload: data,
    });

    selectExperience(data.id);
  };

  const storeExperiences = async (experiences: Experience[]) => {
    for (const experience of experiences) {
      await axios({
        url: `users/${userId}/experiences`,
        method: 'POST',
        data: {
          ...omit(experience, ['id', 'user']),
          userId: userId,
        },
      });
    }

    load();
  };

  const updateExperience = async (experience: Experience) => {
    await axios.request({
      url: `/experiences/${experience.id}`,
      method: 'PATCH',
      data: {
        people: experience.people,
        tags: experience.tags,
        layout: experience.layout,
        description: experience.description,
        name: experience.name,
        userId,
      },
    });

    dispatch({
      type: ExperienceActionType.UPDATE_SELECTED_EXPERIENCE,
      experience,
    });

    dispatchThunk(
      updateFilter({
        tags: experience.tags.filter(tag => !tag.hide).map(tag => tag.id),
        people: experience.people.filter(person => !person.hide).map(person => person.username),
        layout: experience.layout || timelineState.filter?.layout,
        platform: timelineState.filter?.platform,
      }),
    );
  };

  const removeExperience = async (id: string) => {
    await axios({
      url: `/experiences/${id}`,
      method: 'DELETE',
    });

    dispatch({
      type: ExperienceActionType.REMOVE_EXPERIENCE,
      experience_id: id,
    });
  };

  const searchExperience = async (query: string) => {
    const {data} = await axios.request<Experience[]>({
      url: '/experiences',
      method: 'GET',
      params: {
        filter: {
          include: ['user'],
          offset: 0,
          limit: 100,
          skip: 0,
          where: {
            name: {
              like: `.*${query}*`,
              options: 'i',
            },
            id: {
              nin: state.experiences.map(i => i.id),
            },
          },
        },
      },
    });

    dispatch({
      type: ExperienceActionType.SEARCH_EXPERIENCE,
      experiences: data.map(experience => {
        return {
          ...experience,
          // @ts-ignore
          layout: !experience.layout || experience.layout === '' ? 'timeline' : 'photo',
        };
      }),
    });
  };

  const prependExperience = (experience: Experience) => {
    dispatch({
      type: ExperienceActionType.ADD_EXPERIENCE,
      payload: experience,
    });

    selectExperience(experience.id);
  };

  return {
    error,
    loading,
    experiences: state.experiences,
    selected: state.selected,
    edit: state.edit,
    searched: state.searched,
    loadInitExperience: load,
    loadMoreExperience,
    storeExperience,
    storeExperiences,
    updateExperience,
    searchExperience,
    selectExperience,
    editExperience,
    removeExperience,
    prependExperience,
  };
};
