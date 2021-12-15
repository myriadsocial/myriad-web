import React from 'react';

import {SearchBox as SearchBoxComponent} from '.';

type SearchBoxContainerProps = {
  onSubmitSearch?: (args: string) => void;
};

export const SearchBoxContainer: React.FC<SearchBoxContainerProps> = ({onSubmitSearch}) => {
  return <SearchBoxComponent onSubmit={onSubmitSearch} />;
};
