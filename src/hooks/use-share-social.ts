import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {NetworkTypeEnum} from 'src/interfaces/network';
import {SocialsEnum} from 'src/interfaces/social';
import {UserSocialMedia} from 'src/interfaces/user';
import * as NetworkAPI from 'src/lib/api/network';
import * as WalletAPI from 'src/lib/api/wallet';
import {verify} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {
  verifySocialMediaConnected,
  resetVerifyingSocial,
  fetchConnectedSocials,
} from 'src/reducers/user/actions';
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
    blockchain: boolean,
    callback?: () => void,
  ): Promise<void> => {
    setPlatform(platform);

    let username = profileUrl;

    // NOTE: we only need username for verifying twitter & reddit
    if ([SocialsEnum.TWITTER, SocialsEnum.REDDIT].includes(platform)) {
      username = profileUrl.substring(profileUrl.lastIndexOf('/') + 1);
    }

    dispatch(verifySocialMediaConnected(platform, username, address, blockchain, callback));
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
      const {rpcURL} = await NetworkAPI.getNetwork(NetworkTypeEnum.MYRIAD);
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

      verified = await new Promise(resolve => {
        api.query.system.events(events => {
          events.forEach(({event}) => {
            for (let i = 0; i < event.data.length; i++) {
              const data = event.data[i];

              if (data.toString() === 'Success') {
                const userSocialMedia = event.data[i + 1].toHuman() as unknown as UserSocialMedia;
                if (userSocialMedia.userId === user.id) {
                  resolve(true);
                }
              }

              if (data.toString() === 'Failed') {
                resolve(false);
              }
            }
          });
        });
      });

      await api.disconnect();

      if (!verified) {
        throw new Error('Failed to verify');
      }

      dispatch(fetchConnectedSocials());
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
