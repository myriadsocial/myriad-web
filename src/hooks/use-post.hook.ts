import {useState} from 'react';
import {useDispatch} from 'react-redux';

import {useAlertHook} from './use-alert.hook';

import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import * as LocalAPI from 'src/lib/api/local';
import {createPost, importPost, toggleLikePost, deletePost} from 'src/reducers/timeline/actions';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const usePostHook = (user?: User) => {
  const dispatch = useDispatch();
  const {showAlert} = useAlertHook();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faiedUploads, setFailedUpload] = useState<File[]>([]);

  const addPost = async (post: Partial<Post>, files: File[]) => {
    const images: string[] = [];
    const hasMedia = files.length > 0;

    setLoading(true);
    setFailedUpload([]);

    try {
      if (hasMedia) {
        for (const file of files) {
          const imageUrl = await LocalAPI.uploadImage(file);

          if (imageUrl) {
            images.push(imageUrl);
          } else {
            setFailedUpload(prevFailed => [...prevFailed, file]);
          }
        }
      }

      dispatch(createPost(post, images));
    } catch (error) {
      setError(error);
      showAlert({
        title: 'Error!',
        message: 'Failed to create post, try again later',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const importPostUrl = async (url: string) => {
    setLoading(true);

    try {
      await dispatch(importPost(url));

      showAlert({
        title: 'Success!',
        message: 'Post successfully imported',
        severity: 'success',
      });
    } catch (error) {
      setError(error);
      showAlert({
        title: 'Error!',
        message: 'Post already imported',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (post: Post) => {
    setLoading(true);

    dispatch(toggleLikePost(post));
  };

  const dislikePost = async (postId: string) => {
    setLoading(true);

    dispatch(toggleLikePost(postId, false));
  };

  const removePost = async (postId: string) => {
    setLoading(true);

    dispatch(deletePost(postId));
  };

  return {
    error,
    loading,
    faiedUploads,
    addPost,
    importPost: importPostUrl,
    likePost,
    dislikePost,
    removePost,
  };
};
