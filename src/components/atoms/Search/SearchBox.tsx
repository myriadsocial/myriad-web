import React, {useState} from 'react';

import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';

import {SearchBoxProps, SearchBoxColor, useStyles} from '.';
import {SearchIcon} from '../Icons';

import {debounce} from 'lodash';
import i18n from 'src/locale';

const SearchBox: React.FC<SearchBoxProps> = ({
  color = SearchBoxColor.PRIMARY,
  ariaLabel = 'search-box',
  placeholder = i18n.t('Home.Search.Placeholder'),
  isDisabled = false,
  onSubmit,
  ...props
}) => {
  const classes = useStyles();

  const [input, setInput] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const submitClickSearch = () => {
    const debouncedSubmit = debounce(() => {
      if (onSubmit) {
        onSubmit(input);
      }
    }, 500);

    debouncedSubmit();
  };

  const submitSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const debouncedSubmit = debounce(() => {
        if (onSubmit) {
          onSubmit(input);
        }
      }, 500);

      debouncedSubmit();
    }
  };

  return (
    <Paper className={classes.root}>
      <IconButton className={classes.iconButton} aria-label="search" onClick={submitClickSearch}>
        <SearchIcon />
      </IconButton>
      <InputBase
        onKeyUp={submitSearch}
        className={classes.input}
        value={input}
        onChange={handleChange}
        placeholder={placeholder}
        inputProps={{'aria-label': ariaLabel}}
        {...props}
      />
    </Paper>
  );
};

export default SearchBox;
