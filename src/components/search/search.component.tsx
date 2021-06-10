import React, { useState } from 'react';

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import useDebounce from '../../helpers/use-debounce.hooks';
import SearchComponent from '../common/search.component';

//@ts-ignore
type SearchProps = {
  placeholder?: string;
  search: (text: string) => void;
};

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      maxWidth: '100%'
    },
    optionItem: {
      position: 'relative',
      flex: 1
    },
    addButton: {
      position: 'absolute',
      top: 0,
      right: 0
    }
  })
);

const SearchUser: React.FC<SearchProps> = ({ placeholder, search }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedValue = useDebounce(searchQuery, 2000) ?? '';

  React.useEffect(() => {
    search(debouncedValue);
  }, [debouncedValue]);

  const handleSearch = (value: string | null) => {
    if (value) {
      setSearchQuery(value);
    }
  };

  return <SearchComponent value={searchQuery} placeholder={placeholder} onSubmit={handleSearch} />;
};

export default SearchUser;
