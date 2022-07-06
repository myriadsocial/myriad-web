import {useRouter} from 'next/router';

import isArray from 'lodash/isArray';
import {Url} from 'url';

export const useQueryParams = () => {
  const router = useRouter();

  const replace = (url: Partial<Url>): void => {
    router.push(url, undefined, {shallow: true});
  };

  const push = (key: string, value: string | string[], force = false): void => {
    if (!force) {
      const query = router.query;

      query[key] = value;

      router.push({query}, undefined, {shallow: true});
    } else {
      router.push({query: {[key]: value}}, undefined, {shallow: true});
    }
  };

  const getIdByType = (type: string): string | null => {
    let id: string | null = null;

    if (router.query?.type === type && router.query.id) {
      if (isArray(router.query.id)) {
        id = router.query.id[0];
      } else {
        id = router.query.id;
      }
    }

    return id;
  };

  return {
    query: router.query,
    push,
    replace,
    getIdByType,
  };
};
