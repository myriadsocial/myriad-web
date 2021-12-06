import {signIn} from 'next-auth/client';
import getConfig from 'next/config';

import {uniqueNamesGenerator, adjectives, colors} from 'unique-names-generator';

const {publicRuntimeConfig} = getConfig();

export const loginAsAnonymous = async (): Promise<string> => {
  const name = generateAnonymousUser();

  await signIn('credentials', {
    address: null,
    name: name,
    anonymous: true,
    callbackUrl: publicRuntimeConfig.nextAuthURL
      ? publicRuntimeConfig.nextAuthURL + '/welcome'
      : '/welcome',
  });

  return name;
};

export const generateAnonymousUser = (): string => {
  const name: string = uniqueNamesGenerator({
    dictionaries: [adjectives, colors],
    separator: ' ',
  });

  return name;
};
