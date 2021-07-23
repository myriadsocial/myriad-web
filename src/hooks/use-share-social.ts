import {useState} from 'react';
import {useDispatch} from 'react-redux';

import {useAlertHook} from './use-alert.hook';

import Axios, {AxiosError} from 'axios';
import {SocialsEnum} from 'src/interfaces/index';
import {fetchUser} from 'src/reducers/user/actions';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useShareSocial = (userId?: string) => {
  const {showAlert} = useAlertHook();
  const dispatch = useDispatch();

  const [sharing, setSharing] = useState(false);
  const [isShared, setShared] = useState(false);

  const handleError = (error: AxiosError) => {
    console.log('error: ', error.response);
    if (error.response) {
      switch (error.response.status) {
        case 404:
          switch (error.response.data.error.name) {
            case 'Error':
              showAlert({
                title: 'Error',
                message: 'Please enter the correct account address',
                severity: 'error',
              });
              break;
            default:
              switch (error.response.data.error.message) {
                case 'This twitter/facebook/reddit does not belong to you!':
                  showAlert({
                    title: 'Error',
                    message: 'Sorry, this account has been claimed by somebody else',
                    severity: 'error',
                  });
                  break;
                case 'Credential Invalid':
                  showAlert({
                    title: 'Error',
                    message: 'Invalid credentials',
                    severity: 'error',
                  });
                  break;
                default:
                  showAlert({
                    title: 'Error',
                    message: error.response.data.error.message,
                    severity: 'error',
                  });
                  break;
              }
              break;
          }
          break;

        case 400:
          showAlert({
            title: 'Error',
            message: 'Please enter the correct account address',
            severity: 'error',
          });
          break;

        default:
          showAlert({
            title: 'Error',
            message: 'Please enter the correct account address',
            severity: 'error',
          });
          break;
      }
    }
  };

  const verifyPublicKeyShared = async (platform: SocialsEnum, username: string): Promise<void> => {
    if (!userId) return;

    setSharing(true);

    try {
      await MyriadAPI.request({
        method: 'POST',
        url: '/verify',
        data: {
          username,
          platform,
          publicKey: userId,
        },
      });

      setShared(true);
      dispatch(fetchUser(userId));
    } catch (error) {
      const err = error as AxiosError;

      handleError(err);
    } finally {
      setSharing(false);
    }
  };

  const shareOnFacebook = async (username: string): Promise<void> => {
    if (!userId) return;

    setSharing(true);

    try {
      await MyriadAPI.request({
        method: 'POST',
        url: '/verify',
        data: {
          username,
          publicKey: userId,
          platform: SocialsEnum.FACEBOOK,
        },
      });
      setShared(true);
    } catch (error) {
      const err = error as AxiosError;

      handleError(err);
    } finally {
      setSharing(false);
    }
  };

  const shareOnReddit = async (username: string): Promise<void> => {
    if (!userId) return;

    setSharing(true);

    try {
      await MyriadAPI.request({
        method: 'POST',
        url: '/verify',
        data: {
          username,
          publicKey: userId,
          platform: SocialsEnum.REDDIT,
        },
      });

      setShared(true);
    } catch (error) {
      const err = error as AxiosError;

      handleError(err);
    } finally {
      setSharing(false);
    }
  };

  const shareOnTwitter = async (username: string): Promise<void> => {
    if (!userId) return;

    setSharing(true);

    try {
      await MyriadAPI.request({
        method: 'POST',
        url: '/verify',
        data: {
          username,
          publicKey: userId,
          platform: SocialsEnum.TWITTER,
        },
      });

      setShared(true);
    } catch (error) {
      const err = error as AxiosError;

      handleError(err);
    } finally {
      setSharing(false);
    }
  };

  return {
    sharing,
    isShared,
    verifyPublicKeyShared,
    shareOnFacebook,
    shareOnReddit,
    shareOnTwitter,
  };
};
