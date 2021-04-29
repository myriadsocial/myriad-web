// @ts-nocheck
import { useState } from 'react';

import { People } from 'src/interfaces/experience';
import * as PeopleAPI from 'src/lib/api/people';

export const usePeople = () => {
  const [people, setPeople] = useState<People[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query: string) => {
    setLoading(true);

    try {
      const data = await PeopleAPI.searchPeople(query);

      setPeople(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    people,
    search
  };
};
