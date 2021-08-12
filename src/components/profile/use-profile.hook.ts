import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useAlertHook} from 'src/hooks/use-alert.hook';
import {useImageUpload} from 'src/hooks/use-image-upload.hook';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {fetchProfileDetail} from 'src/reducers/profile/actions';
import {ProfileState} from 'src/reducers/profile/reducer';
import {updateUser} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

export const useProfileHook = () => {
  const dispatch = useDispatch();
  const {uploadImage} = useImageUpload();
  const {showAlert} = useAlertHook();

  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
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

  const updateProfilePicture = (url: string) => {
    setUploadingAvatar(true);

    dispatch(
      updateUser(
        {
          profilePictureURL: url,
        },
        () => {
          if (user && profileDetail?.id === user.id) {
            dispatch(fetchProfileDetail(user.id));
          }

          setUploadingAvatar(false);
        },
      ),
    );
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
      } else {
        setUploadingBanner(false);
      }
    } catch (error) {
      setUploadingBanner(false);
    }
  };

  return {
    loading,
    uploadingAvatar,
    uploadingBanner,
    updateProfile,
    updateProfilePicture,
    updateProfileBanner,
  };
};
