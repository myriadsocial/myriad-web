import React from 'react';

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
  return (
    <SearchBoxComponent
      onSubmit={onSubmitSearch}
      iconPosition={iconPosition}
      outlined={outlined}
      hidden={hidden}
    />
  );
};
