import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useUpload} from 'src/hooks/use-upload.hook';
import {User} from 'src/interfaces/user';
import * as UserAPI from 'src/lib/api/user';
import {RootState} from 'src/reducers';
import {fetchProfileDetail} from 'src/reducers/profile/actions';
import {ProfileState} from 'src/reducers/profile/reducer';
import {updateUser} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

export const useProfileHook = () => {
  const dispatch = useDispatch();
  const {uploadImage} = useUpload();

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | undefined>();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {detail: profileDetail, loading} = useSelector<RootState, ProfileState>(
    state => state.profileState,
  );

  const updateProfile = (attributes: Partial<User>, callback?: () => void) => {
    setLoadingUpdate(true);
    dispatch(
      updateUser(attributes, () => {
        if (user && profileDetail?.id === user.id) {
          dispatch(fetchProfileDetail(user.id));
          callback && callback();
          setLoadingUpdate(false);
        }
      }),
    );
  };

  const updateProfilePicture = async (image: File) => {
    setUploadingAvatar(true);
    setLoadingUpdate(true);
    try {
      const url = await uploadImage(image);
      return url;
    } finally {
      setUploadingAvatar(false);
      setLoadingUpdate(false);
    }
  };

  const updateProfileBanner = async (image: File) => {
    setUploadingBanner(true);
    setLoadingUpdate(true);
    try {
      const url = await uploadImage(image);
      return url;
    } catch (error) {
      console.log('[useProfileHook][updateProfileBanner][error]', error);
      return false;
    } finally {
      setUploadingBanner(false);
      setLoadingUpdate(false);
    }
  };

  const checkUsernameStatus = async (): Promise<void> => {
    if (!user) return;

    try {
      const {data} = await UserAPI.checkUsername(user.id);
      if (data.length) {
        setUsernameStatus(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkUsernameAvailable = async (
    username: string,
    callback?: (valid: boolean) => void,
  ): Promise<void> => {
    let available = false;

    try {
      const data = await UserAPI.getUsername(username);

      available = !data;
    } catch (error) {
      console.log(error);
    }

    setUsernameAvailable(available);

    callback && callback(available);
  };

  return {
    loading,
    loadingUpdate,
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
