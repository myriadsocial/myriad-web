import {useCallback, useState} from 'react';

export type UseToggle = (state: boolean) => [boolean, () => void];

export const useToggle: UseToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState(state => !state), []);

  return [state, toggle];
};
