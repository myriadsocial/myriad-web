import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useImageUpload} from 'src/hooks/use-image-upload.hook';
import {User} from 'src/interfaces/user';
import * as UserAPI from 'src/lib/api/user';
import {RootState} from 'src/reducers';
import {fetchProfileDetail} from 'src/reducers/profile/actions';
import {ProfileState} from 'src/reducers/profile/reducer';
import {updatePostPlatformUser} from 'src/reducers/timeline/actions';
import {updateUser} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

export const useProfileHook = () => {
  const dispatch = useDispatch();
  const {uploadImage} = useImageUpload();

  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | undefined>();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {detail: profileDetail, loading} = useSelector<RootState, ProfileState>(
    state => state.profileState,
  );

  const updateProfile = (attributes: Partial<User>) => {
    dispatch(
      updateUser(attributes, () => {
        if (user && profileDetail?.id === user.id) {
          dispatch(fetchProfileDetail(user.id));
        }
      }),
    );
  };

  const updateProfilePicture = async (image: File) => {
    setUploadingAvatar(true);

    try {
      const url = await uploadImage(image);

      if (url)
        dispatch(
          updateUser({profilePictureURL: url}, () => {
            if (user && profileDetail?.id === user.id) {
              dispatch(fetchProfileDetail(user.id));
            }

            dispatch(updatePostPlatformUser(url));
          }),
        );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const updateProfileBanner = async (image: File): Promise<void> => {
    setUploadingBanner(true);

    try {
      const url = await uploadImage(image);

      if (url) {
        dispatch(
          updateUser(
            {
              bannerImageUrl: url,
            },
            () => {
              setUploadingBanner(false);
            },
          ),
        );
      }
    } catch (error) {
      console.log('[useProfileHook][updateProfileBanner][error]', error);
    } finally {
      setUploadingBanner(false);
    }
  };

  const checkUsernameStatus = async (): Promise<void> => {
    if (!user) return;

    try {
      const {data} = await UserAPI.checkUsername(user.id);
      if (data.length) {
        console.log(data);
        setUsernameStatus(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkUsernameAvailable = async (query: string): Promise<void> => {
    if (!user) return;

    try {
      const {data} = await UserAPI.searchUsername(query);
      if (data.length) {
        setUsernameAvailable(false);
      } else {
        setUsernameAvailable(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    loading,
    uploadingAvatar,
    uploadingBanner,
    updateProfile,
    updateProfilePicture,
    updateProfileBanner,
    checkUsernameStatus,
    checkUsernameAvailable,
    usernameStatus,
    usernameAvailable,
  };
};
