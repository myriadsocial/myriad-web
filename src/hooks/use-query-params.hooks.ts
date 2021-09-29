import {useRouter} from 'next/router';

export const useQueryParams = () => {
  const router = useRouter();

  const push = (key: string, value: string | string[]): void => {
    const query = router.query;

    query[key] = value;

    router.push({query}, undefined, {shallow: true});
  };

  return {query: router.query, push};
};
