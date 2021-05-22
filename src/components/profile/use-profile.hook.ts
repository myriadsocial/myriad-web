// @ts-nocheck
import { useState, useEffect } from 'react';

import { ExtendedUserPost } from 'src/interfaces/user';
import { User } from 'src/interfaces/user';
import * as ProfileAPI from 'src/lib/api/profile';

export const useProfileHook = id => {
  const [profile, setProfile] = useState<ExtendedUserPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('masuk');
    // state is updated but not react
    // console.log('profile', profile);
    getProfile();
  }, [profile?.name, profile?.bio, profile?.profilePictureURL]);

  const getProfile = async () => {
    setLoading(true);

    try {
      let detail: ExtendedUser = await ProfileAPI.getUserProfile(id as string);

      if (!detail.posts) {
        detail.posts = [];
      } else {
        let data = detail.posts;
        detail.posts = data.map((item: Post) => ({ ...item, comments: item.comments || [] }));
      }

      // if (!detail.posts.comments) {
      //   detail.posts.comments = [];
      // }

      // if (!detail.posts.comments.user) {
      //   detail.posts.comments.user = [];
      // }

      setProfile({
        ...detail
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
    updateProfile
  };
};
