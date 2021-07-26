import {useSelector, useDispatch} from 'react-redux';

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

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {detail: profileDetail, loading} = useSelector<RootState, ProfileState>(
    state => state.profileState,
  );

  const updateProfile = (attributes: Partial<User>) => {
    dispatch(updateUser(attributes));

    if (user && profileDetail?.id === user.id) {
      dispatch(fetchProfileDetail(user.id));
    }
  };

  const updateProfilePicture = (url: string) => {
    dispatch(
      updateUser({
        profilePictureURL: url,
      }),
    );

    if (user && profileDetail?.id === user.id) {
      dispatch(fetchProfileDetail(user.id));
    }
  };

  const updateProfileBanner = async (image: File): Promise<void> => {
    const url = await uploadImage(image);

    dispatch(
      updateUser({
        bannerImageUrl: url,
      }),
    );
  };

  return {
    loading,
    updateProfile,
    updateProfilePicture,
    updateProfileBanner,
  };
};
