import React from 'react';

import {SearchBox as SearchBoxComponent} from '.';

type SearchBoxContainerProps = {
  onSubmitSearch?: (args: string) => void;
  iconPosition?: 'start' | 'end';
  outlined?: boolean;
};

export const SearchBoxContainer: React.FC<SearchBoxContainerProps> = ({
  onSubmitSearch,
  iconPosition,
  outlined,
}) => {
  return (
    <SearchBoxComponent onSubmit={onSubmitSearch} iconPosition={iconPosition} outlined={outlined} />
  );
};
