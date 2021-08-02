import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useAlertHook} from './use-alert.hook';

import {SocialsEnum} from 'src/interfaces/index';
import {RootState} from 'src/reducers';
import {verifySocialMediaConnected, resetVerifyingSocial} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useShareSocial = () => {
  const {showAlert} = useAlertHook();
  const dispatch = useDispatch();

  const {user, verifying, error} = useSelector<RootState, UserState>(state => state.userState);
  const [platform, setPlatform] = useState<SocialsEnum | null>(null);
  const [isVerified, setVerified] = useState(false);

  // show error when verification fail
  useEffect(() => {
    if (verifying && error) {
      showAlert({
        message: error,
        severity: 'error',
        title: 'Error',
      });

      dispatch(resetVerifyingSocial());
    }
  }, [error, verifying]);

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
    const found = user?.userCredentials?.find(credential => {
      return credential.people.platform === platform;
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
