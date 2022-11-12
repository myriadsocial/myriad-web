//TODO
//1. Create api file for auth with link
//2. Use it with loginWithEmail
import getConfig from 'next/config';

import * as AuthLinkAPI from 'src/lib/api/auth-link';
import {SignupWithEmailProps} from 'src/lib/api/auth-link';

const {publicRuntimeConfig} = getConfig();

export const useAuthLinkHook = () => {
  const registerWithEmail = async (values: SignupWithEmailProps) => {
    try {
      const data = await AuthLinkAPI.signUpWithEmail(values);

      return data;
    } catch (error) {
      console.log({error});
    }
  };

  const requestLink = async (email: string): Promise<string> => {
    try {
      const message = await AuthLinkAPI.getLinkWithEmail({
        email,
        callbackURL: publicRuntimeConfig.appAuthURL + '/login',
      });

      return message;
    } catch (error) {
      return error;
    }
  };

  const loginWithLink = async (token: string): Promise<string> => {
    try {
      const accessToken = await AuthLinkAPI.loginWithLink(token);

      return accessToken;
    } catch (error) {
      console.log({error});
    }
  };

  return {
    registerWithEmail,
    requestLink,
    loginWithLink,
  };
};
