import { useState } from 'react';

import { useTimeline, TimelineActionType } from 'src/context/timeline.context';
import { useUser } from 'src/context/user.context';
import { Post } from 'src/interfaces/post';
import { TimelineType, PostFilter, PostSortMethod } from 'src/interfaces/timeline';
import { User } from 'src/interfaces/user';
import * as PostAPI from 'src/lib/api/post';
import * as UserAPI from 'src/lib/api/user';

export const useTimelineHook = () => {
  const {
    state: { user, anonymous }
  } = useUser();
  const {
    state: { filter: storedFilter, page, sort, type },
    dispatch
  } = useTimeline();

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTimeline = async (page: number = 1, sort?: PostSortMethod, filter?: PostFilter) => {
    if (user && type === TimelineType.DEFAULT) {
      return loadUserPosts(user, page, sort, filter);
    }

    if (anonymous || type === TimelineType.TRENDING) {
      return loadPosts(page, sort, filter);
    }
  };

  const loadUserPosts = async (user: User, page = 1, sort?: PostSortMethod, filter?: PostFilter) => {
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

  const loadPosts = async (page = 1, sort: PostSortMethod = 'created', filter?: PostFilter) => {
    setLoading(true);

    try {
      const data = await PostAPI.getPost(page, sort, filter ?? storedFilter);

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
