import {SearchIcon} from '@heroicons/react/solid';

import React, {useState} from 'react';

import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import SvgIcon from '@material-ui/core/SvgIcon';

import {SearchBoxProps, SearchBoxColor, useStyles} from './';

import {debounce} from 'lodash';

const SearchBox = ({
  color = SearchBoxColor.PRIMARY,
  ariaLabel = 'search-box',
  placeholder = 'Search something here',
  isDisabled = false,
  onSubmit,
  ...props
}: SearchBoxProps): JSX.Element => {
  const classes = useStyles();

  const [input, setInput] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const submitSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const debouncedSubmit = debounce(() => {
        onSubmit(input);
      }, 500);

      debouncedSubmit();
    }
  };

  return (
    <Paper className={classes.root}>
      <IconButton
        className={classes.iconButton}
        aria-label="search"
        onClick={() => onSubmit(input)}>
        <SvgIcon component={SearchIcon} viewBox="0 0 24 24" />
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
