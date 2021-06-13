// @ts-nocheck
import { useState, useEffect } from 'react';

import { useProfile, ProfileActionType } from 'src/components/profile/profile.context';
import { useUserHook } from 'src/hooks/use-user.hook';
import { Post } from 'src/interfaces/post';
import { ExtendedUserPost } from 'src/interfaces/user';
import { User } from 'src/interfaces/user';
import * as ProfileAPI from 'src/lib/api/profile';

export const useProfileHook = (id: string) => {
  const { state: profileState, dispatch } = useProfile();
  const { getUserDetail } = useUserHook(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProfile = async () => {
    setLoading(true);

    try {
      let detail: ExtendedUser = await ProfileAPI.getUserProfile(id as string);
      let posts = await ProfileAPI.getPostProfile(id as string);

      posts = posts.map((item: Post) => ({ ...item, comments: item.comments || [] }));

      const data = {
        ...detail,
        posts: [...posts]
      };

      dispatch({
        type: ProfileActionType.PROFILE_LOADED,
        payload: data
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadImportedPost = async () => {
    setLoading(true);

    try {
      let posts = await ProfileAPI.getImportedPost(id as string);

      posts = posts.map((item: Post) => ({ ...item, comments: item.comments || [] }));

      dispatch({
        type: ProfileActionType.IMPORTEDPOST_LOADED,
        payload: posts
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (attributes: Partial<User>) => {
    setLoading(true);

    try {
      const data = ProfileAPI.updateUserProfile(id as string, attributes);

      getProfile();
      getUserDetail();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    updateProfile,
    getProfile,
    loadImportedPost
  };
};
