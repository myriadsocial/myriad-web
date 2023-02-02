//TODO
//1. Create api file for auth with link
//2. Use it with loginWithEmail
import getConfig from 'next/config';

import Cookies from 'js-cookie';
import * as AuthLinkAPI from 'src/lib/api/auth-link';

//3. When clicking on link, parse the query on /login
//4. Create api call for POST /login/otp with useEffect when parsing query on /login
//5. Call signIn with otp and email, check if it exists and no signature is required, and then call the api call in #4

const {publicRuntimeConfig} = getConfig();
const instance = Cookies.get('instance');

export const useAuthLinkHook = () => {
  const requestLink = async (email: string): Promise<string> => {
    try {
      const message = await AuthLinkAPI.getLinkWithEmail({
        email,
        callbackURL: (instance ?? publicRuntimeConfig.appAuthURL) + '/login',
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
    requestLink,
    loginWithLink,
  };
};
