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

      const found = people.some(person => person.username === data[0]?.username);

      if (found) {
        setPeople([]);
      } else {
        setPeople(data);
        setFound(false);
      }
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
