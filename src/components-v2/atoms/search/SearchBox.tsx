import {SearchIcon} from '@heroicons/react/solid';

import React, {useState} from 'react';

import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import SvgIcon from '@material-ui/core/SvgIcon';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

import {SearchBoxProps, SearchBoxColor} from './';

import {debounce} from 'lodash';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 643,
      height: 52,
      borderRadius: 10,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);

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
