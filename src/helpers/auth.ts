import {signIn} from 'next-auth/client';
import getConfig from 'next/config';

import {uniqueNamesGenerator, adjectives, colors} from 'unique-names-generator';

const {publicRuntimeConfig} = getConfig();

export const loginAsAnonymous = async (): Promise<void> => {
  const name: string = uniqueNamesGenerator({
    dictionaries: [adjectives, colors],
    separator: ' ',
  });

  await signIn('credentials', {
    address: null,
    name: name,
    anonymous: true,
    callbackUrl: publicRuntimeConfig.nextAuthURL
      ? publicRuntimeConfig.nextAuthURL + '/welcome'
      : '/welcome',
  });
};
