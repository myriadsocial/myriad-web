import { useState } from 'react';

import { TimelineActionType } from '../timeline/timeline.context';
import { usePost } from '../timeline/use-post.hooks';
import { useExperience as baseUseExperience, ExperienceActionType } from './experience.context';

import Axios from 'axios';
import { omit } from 'lodash';
import { Experience } from 'src/interfaces/experience';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const useExperience = () => {
  const { state, dispatch } = baseUseExperience();
  const { loadInitPost } = usePost();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    offset: 0,
    limit: 4,
    skip: 0,
    include: ['user'],
    order: 'createdAt'
  });

  const load = async (type: ExperienceActionType = ExperienceActionType.INIT_EXPERIENCE) => {
    setLoading(true);

    try {
      const { data } = await axios({
        url: '/experiences',
        method: 'GET',
        params: {
          filter: params
        }
      });

      dispatch({
        type: ExperienceActionType.INIT_EXPERIENCE,
        experiences: data
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
      skip: (params.skip + 1) * params.limit
    };

    setLoading(true);

    try {
      const { data } = await axios({
        url: '/experiences',
        method: 'GET',
        params: {
          filter
        }
      });

      setParams(filter);

      if (data.length > 0) {
        dispatch({
          type: ExperienceActionType.SHOW_MORE_EXPERIENCE,
          experiences: data
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
        experience
      });

      loadInitPost(TimelineActionType.INIT_POST, experience.tags);
    }
  };

  const editExperience = async (data: Experience, tags: string[], people: string[]) => {
    dispatch({
      type: ExperienceActionType.EDIT_EXPERIENCE,
      experience_id: data.id,
      experience: {
        ...data,
        tags,
        people
      }
    });
  };

  const storeExperience = async (experience: Experience) => {
    const { data } = await axios({
      url: '/experiences',
      method: 'POST',
      data: omit(experience, ['id', 'user', 'description', 'layout'])
    });

    dispatch({
      type: ExperienceActionType.ADD_EXPERIENCE,
      payload: data
    });

    selectExperience(data.id);
  };

  const removeExperience = async (id: string) => {
    const { data } = await axios({
      url: `/experiences/${id}`,
      method: 'DELETE'
    });

    console.log('removeExperience', data);
    dispatch({
      type: ExperienceActionType.REMOVE_EXPERIENCE,
      experience_id: id
    });
  };

  const searchExperience = async () => {
    const result = await axios({
      url: '/experiences',
      method: 'POST',
      params: {
        query: {
          where: {}
        }
      }
    });

    console.log('result: ', result);
  };

  return {
    error,
    loading,
    experiences: state.experiences,
    selected: state.selected,
    edit: state.edit,
    loadInitExperience: load,
    loadMoreExperience,
    storeExperience,
    searchExperience,
    selectExperience,
    editExperience,
    removeExperience
  };
};
