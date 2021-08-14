import {formatDistance} from 'date-fns';

export const timeAgo = (value: string | Date): string => {
  return formatDistance(new Date(value), new Date(), {addSuffix: true});
};
