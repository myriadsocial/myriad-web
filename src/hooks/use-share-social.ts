import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {NetworkIdEnum} from 'src/interfaces/network';
import {SocialsEnum} from 'src/interfaces/social';
import * as NetworkAPI from 'src/lib/api/network';
import * as UserSocialAPI from 'src/lib/api/social';
import * as WalletAPI from 'src/lib/api/wallet';
import {verify} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {verifySocialMediaConnected, resetVerifyingSocial} from 'src/reducers/user/actions';
import * as constants from 'src/reducers/user/constants';
import {UserState} from 'src/reducers/user/reducer';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useShareSocial = () => {
  const dispatch = useDispatch();

  const {user, socials, verifying, error} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const [platform, setPlatform] = useState<SocialsEnum | null>(null);
  const [isVerified, setVerified] = useState(false);
  const [isSignerLoading, setSignerLoading] = useState(false);

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
    profileUrl: string,
    address: string,
    callback?: () => void,
  ): Promise<void> => {
    setPlatform(platform);

    let username = profileUrl;

    // NOTE: we only need username for verifying twitter & reddit
    if ([SocialsEnum.TWITTER, SocialsEnum.REDDIT].includes(platform)) {
      username = profileUrl.substring(profileUrl.lastIndexOf('/') + 1);
    }

    dispatch(verifySocialMediaConnected(platform, username, address, callback));
  };

  const verifySocialMedia = async (
    social: string,
    username: string,
    account: InjectedAccountWithMeta,
    callback?: ({isVerified: boolean}) => void,
  ) => {
    if (!user) return;

    let verified = false;

    try {
      const {rpcURL} = await NetworkAPI.getNetwork(NetworkIdEnum.MYRIAD);
      const serverId = await WalletAPI.getServerId();
      const response = await fetch('/api/access-token');
      const {accessToken} = await response.json();

      if (!accessToken) throw new Error('Token not found');

      const socialMediaCredential = {username, platform: social};
      const ftIdentifier = 'native'; // TODO: handle multiple currencies

      const api = await verify(
        account,
        rpcURL,
        serverId,
        accessToken,
        socialMediaCredential,
        ftIdentifier,
        ({signerOpened}) => {
          if (signerOpened) {
            setSignerLoading(true);
          }
        },
      );

      if (!api) throw new Error('Cancel transaction');

      await new Promise(resolve => {
        api.query.system.events(events => {
          events.forEach(({event}) => {
            event.data.forEach(record => {
              if (record.toString() === 'Success') resolve(true);
              if (record.toString() === 'Failed') resolve(false);
            });
          });
        });
      });

      await api.disconnect();

      const currentTotal = socials.length;
      const updatedSocialMedia = await UserSocialAPI.getUserSocials(user.id, true);
      const updatedTotal = updatedSocialMedia.data.length;

      if (currentTotal === updatedTotal) verified = false;
      if (currentTotal < updatedTotal) verified = true;

      dispatch({
        type: constants.FETCH_USER_SOCIALS,
        payload: updatedSocialMedia.data,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setSignerLoading(false);
      callback && callback({isVerified: verified});
    }
  };

  return {
    isVerifying: verifying,
    isVerified,
    resetVerification,
    verifyPublicKeyShared,
    verifySocialMedia,
    isSignerLoading,
  };
};
