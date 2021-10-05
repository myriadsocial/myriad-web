import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {SocialsEnum} from 'src/interfaces/social';
import {RootState} from 'src/reducers';
import {verifySocialMediaConnected, resetVerifyingSocial} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useShareSocial = () => {
  const dispatch = useDispatch();

  const {user, socials, verifying, error} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const [platform, setPlatform] = useState<SocialsEnum | null>(null);
  const [isVerified, setVerified] = useState(false);

  useEffect(() => {
    if (verifying && !error) {
      checkIsVerified();
    }
  }, [user, verifying, error]);

  const resetVerification = () => {
    setVerified(false);
    setPlatform(null);
  };

  const checkIsVerified = () => {
    const found = socials.find(social => {
      return social.platform === platform;
    });

    const verified = Boolean(found);

    setVerified(verified);

    if (verified) {
      dispatch(resetVerifyingSocial());
    }
  };

  const verifyPublicKeyShared = async (
    platform: SocialsEnum,
    username: string,
    callback?: () => void,
  ): Promise<void> => {
    setPlatform(platform);
    dispatch(verifySocialMediaConnected(platform, username, callback));
  };

  return {
    isVerifying: verifying,
    isVerified,
    resetVerification,
    verifyPublicKeyShared,
  };
};
