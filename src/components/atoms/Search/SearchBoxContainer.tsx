import React from 'react';

import {SearchBox as SearchBoxComponent} from '.';

type SearchBoxContainerProps = {
  onSubmitSearch?: (args: string) => void;
  reverse?: boolean;
};

export const SearchBoxContainer: React.FC<SearchBoxContainerProps> = ({
  onSubmitSearch,
  reverse,
}) => {
  return <SearchBoxComponent onSubmit={onSubmitSearch} reverse={reverse} />;
};
