import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

import {InputBaseProps, InputBaseColor} from './';

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
  color = InputBaseColor.PRIMARY,
  ariaLabel = 'search-box',
  placeholder = 'Search something here',
  isDisabled = false,
}: InputBaseProps): JSX.Element => {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder={placeholder}
        inputProps={{'aria-label': ariaLabel}}
      />
    </Paper>
  );
};

export default SearchBox;
