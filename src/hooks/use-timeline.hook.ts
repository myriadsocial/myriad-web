import { useState } from 'react';

import { useTimeline, TimelineActionType } from 'src/context/timeline.context';
import { useUser } from 'src/context/user.context';
import { Post, PostSortMethod } from 'src/interfaces/post';
import { User } from 'src/interfaces/user';
import * as PostAPI from 'src/lib/api/post';
import * as UserAPI from 'src/lib/api/user';

export const useTimelineHook = () => {
  const {
    state: { user, anonymous }
  } = useUser();
  const {
    state: { filter, page, sort },
    dispatch
  } = useTimeline();

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTimeline = async (page: number = 1, sort?: PostSortMethod) => {
    if (user) {
      await loadUserPosts(user, page, sort);
    }

    if (anonymous) {
      await loadPosts(page, sort);
    }
  };

  const loadUserPosts = async (user: User, page: number = 1, sort?: PostSortMethod) => {
    setLoading(true);

    try {
      const data = await PostAPI.getFriendPost(user.id, page, sort);

      if (data.length < 10) {
        setHasMore(false);
      }

      // TODO: should be provided by backend
      if (data.length > 0) {
        for await (const post of data) {
          if (post.importBy && post.importBy.length > 0) {
            const user = await UserAPI.getUserDetail(post.importBy[0]);

            post.importer = user;
          }

          if (post.platform === 'myriad' && post.platformUser) {
            const user = await UserAPI.getUserDetail(post.platformUser.platform_account_id);

            post.platformUser.profilePictureURL = user.profilePictureURL;
          }
        }
      }

      dispatch({
        type: TimelineActionType.LOAD_POST,
        posts: data.map((item: Post) => ({ ...item, comments: item.comments || [] }))
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async (page: number = 1, sort: PostSortMethod = 'created') => {
    setLoading(true);

    try {
      const data = await PostAPI.getPost(page, sort, filter);

      if (data.length < 10) {
        setHasMore(false);
      }

      dispatch({
        type: TimelineActionType.LOAD_POST,
        posts: data.map((item: Post) => ({ ...item, comments: item.comments || [] }))
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const nextPosts = async () => {
    dispatch({
      type: TimelineActionType.LOAD_MORE_POST
    });

    await loadTimeline(page + 1);
  };

  const sortTimeline = async (sort: PostSortMethod) => {
    dispatch({
      type: TimelineActionType.SORT_POST,
      sort
    });

    await loadTimeline(1, sort);
  };

  return {
    error,
    loading,
    hasMore,
    sort,
    loadTimeline,
    nextPosts,
    sortTimeline
  };
};
