import {useRouter} from 'next/router';

export const useQueryParams = () => {
  const router = useRouter();

  const push = (key: string, value: string | string[], force = false): void => {
    if (!force) {
      const query = router.query;

      query[key] = value;

      router.push({query}, undefined, {shallow: true});
    } else {
      router.push({query: {[key]: value}}, undefined, {shallow: true});
    }
  };

  return {query: router.query, push};
};
