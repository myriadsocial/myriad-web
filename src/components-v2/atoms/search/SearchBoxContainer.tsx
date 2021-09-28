import React from 'react';

import {SearchBox as SearchBoxComponent} from '.';

export const SearchBoxContainer: React.FC = () => {
  return <SearchBoxComponent onSubmit={value => console.log(value)} />;
};
