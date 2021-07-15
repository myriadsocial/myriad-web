import React, { useState } from 'react';

import { useRouter } from 'next/router';

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import SearchComponent from '../common/search.component';

type SearchProps = {
  placeholder?: string;
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

const SearchUser: React.FC<SearchProps> = ({ placeholder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (value: string) => {
    if (value) {
      setSearchQuery(value);
      router.push(`/search?q=${value}`);
    }
  };

  return <SearchComponent value={searchQuery} placeholder={placeholder} onSubmit={handleSearch} />;
};

export default SearchUser;
