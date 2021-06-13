import { useState } from 'react';

import { useAlertHook } from './use-alert.hook';

import { useTimeline, TimelineActionType } from 'src/context/timeline.context';
import { User } from 'src/interfaces/user';
import * as LocalAPI from 'src/lib/api/local';
import * as PostAPI from 'src/lib/api/post';

export const usePostHook = (user: User) => {
  const { dispatch } = useTimeline();
  const { showAlert } = useAlertHook();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addPost = async (text: string, tags: string[], files: File[]) => {
    const images: string[] = [];

    if (files.length) {
      const uploadedURLs = await Promise.all(files.map(file => LocalAPI.uploadImage(file)));

      uploadedURLs.forEach(url => {
        if (url) {
          images.push(url);
        }
      });
    }

    const hasMedia = files.length > 0;

    const data = await PostAPI.createPost({
      text,
      tags: tags,
      hasMedia,
      platform: 'myriad',
      assets: hasMedia ? images : [],
      platformUser: {
        username: user.name,
        platform_account_id: user.id,
        profilePictureURL: user.profilePictureURL
      },
      walletAddress: user.id
    });

    dispatch({
      type: TimelineActionType.CREATE_POST,
      post: {
        ...data,
        comments: []
      }
    });
  };

  const loadComments = async (postId: string) => {
    const data = await PostAPI.loadComments(postId);

    dispatch({
      type: TimelineActionType.LOAD_COMMENTS,
      postId,
      comments: data
    });
  };

  const importPost = async (url: string, importer?: string) => {
    setLoading(true);

    try {
      const data = await PostAPI.importPost({
        url,
        importer: importer || user.id
      });

      dispatch({
        type: TimelineActionType.CREATE_POST,
        post: {
          ...data,
          comments: []
        }
      });

      showAlert({
        title: 'Success!',
        message: 'Post successfully imported',
        severity: 'success'
      });
    } catch (error) {
      console.log('error from use post hooks: ', error);
      setError(error);
      showAlert({
        title: 'Error!',
        message: 'Post already imported',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId: string) => {
    setLoading(true);

    try {
      await PostAPI.like(user.id, postId);
    } catch (error) {
      console.log('error likePost: ', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const dislikePost = async (postId: string) => {
    setLoading(true);

    try {
      await PostAPI.dislike(user.id, postId);
    } catch (error) {
      console.log('error from use post hooks: ', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    loadComments,
    addPost,
    importPost,
    likePost,
    dislikePost
  };
};
