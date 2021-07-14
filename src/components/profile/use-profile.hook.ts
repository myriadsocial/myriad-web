// @ts-nocheck
import { useState, useEffect } from 'react';

import { useProfile, ProfileActionType } from 'src/components/profile/profile.context';
import { useUser, UserActionType } from 'src/context/user.context';
import { useImageUpload } from 'src/hooks/use-image-upload.hook';
import { useUserHook } from 'src/hooks/use-user.hook';
import { Post } from 'src/interfaces/post';
import { ExtendedUserPost } from 'src/interfaces/user';
import { User } from 'src/interfaces/user';
import * as ProfileAPI from 'src/lib/api/profile';

export const useProfileHook = (id: string) => {
  const { state: profileState, dispatch } = useProfile();

  const { updateUser } = useUserHook(id);
  const { uploadImage } = useImageUpload();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProfile = async () => {
    setIsLoading(true);

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
      setIsLoading(false);
    }
  };

  const loadImportedPost = async () => {
    setIsLoading(true);

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
      setIsLoading(false);
    }
  };

  const updateProfile = async (attributes: Partial<User>) => {
    setIsLoading(true);

    try {
      await updateUser(attributes);

      if (profileState.profile) {
        dispatch({
          type: ProfileActionType.PROFILE_LOADED,
          payload: {
            ...profileState.profile,
            ...attributes
          }
        });
      } else {
        getProfile();
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBanner = async (file: File) => {
    setIsLoading(true);

    try {
      const url = await uploadImage(file);

      await updateProfile({
        bannerImageUrl: url
      });

      if (profileState.profile) {
        dispatch({
          type: ProfileActionType.PROFILE_LOADED,
          payload: {
            ...profileState.profile,
            bannerImageUrl: url
          }
        });
      } else {
        getProfile();
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    updateProfile,
    updateBanner,
    getProfile,
    loadImportedPost
  };
};
