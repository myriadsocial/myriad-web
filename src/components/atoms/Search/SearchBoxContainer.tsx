import React from 'react';

import {useRouter} from 'next/router';

import {SearchBox as SearchBoxComponent} from '.';

type SearchBoxContainerProps = {
  onSubmitSearch?: (args: string) => void;
  iconPosition?: 'start' | 'end';
  outlined?: boolean;
  hidden?: boolean;
};

export const SearchBoxContainer: React.FC<SearchBoxContainerProps> = ({
  onSubmitSearch,
  iconPosition,
  outlined,
  hidden,
}) => {
  const router = useRouter();

  const performSearch = (query: string) => {
    const DELAY = 100;
    setTimeout(() => {
      // shallow push, without rerender page
      router.push(
        {
          pathname: 'search',
          query: {
            q: query,
          },
        },
        undefined,
        {shallow: true},
      );
    }, DELAY);
  };

  return (
    <SearchBoxComponent
      onSubmit={performSearch}
      iconPosition={iconPosition}
      outlined={outlined}
      hidden={hidden}
    />
  );
};
