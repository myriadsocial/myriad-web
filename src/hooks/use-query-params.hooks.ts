import {useRouter} from 'next/router';

export const useQueryParams = () => {
  const router = useRouter();

<<<<<<< HEAD
  const push = (key: string, value: string | string[], force = false): void => {
    if (!force) {
      const query = router.query;

      query[key] = value;

      router.push({query}, undefined, {shallow: true});
    } else {
      router.push({query: {[key]: value}}, undefined, {shallow: true});
    }
=======
  const push = (key: string, value: string | string[]): void => {
    const query = router.query;

    query[key] = value;

    router.push({query}, undefined, {shallow: true});
>>>>>>> 59dc8324 (MYR-870: init timeline)
  };

  return {query: router.query, push};
};
