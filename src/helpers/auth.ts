import {uniqueNamesGenerator, adjectives, colors} from 'unique-names-generator';

export const generateAnonymousUser = (): string => {
  const name: string = uniqueNamesGenerator({
    dictionaries: [adjectives, colors],
    separator: ' ',
  });

  return name;
};
