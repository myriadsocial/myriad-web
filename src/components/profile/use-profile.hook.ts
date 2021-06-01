// @ts-nocheck
import { useState, useEffect } from 'react';

import { ExtendedUserPost } from 'src/interfaces/user';
import { User } from 'src/interfaces/user';
import * as ProfileAPI from 'src/lib/api/profile';

export const useProfileHook = id => {
  const [profile, setProfile] = useState<ExtendedUserPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProfile = async () => {
    setLoading(true);

    try {
      let detail: ExtendedUser = await ProfileAPI.getUserProfile(id as string);
      let posts = await ProfileAPI.getPostProfile(id as string);

      posts = posts.map((item: Post) => ({ ...item, comments: item.comments || [] }));

      setProfile({
        ...detail,
        posts: [...posts]
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

      setProfile({
        ...profile,
        ...attributes
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    profile,
    updateProfile,
    getProfile
  };
};
