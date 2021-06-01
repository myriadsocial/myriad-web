import React from 'react';

import InputBase from '@material-ui/core/InputBase';
import { makeStyles, createStyles, fade, Theme } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(0),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 'auto'
      },
      '& .MuiInputBase-root': {
        width: '100%',
        padding: theme.spacing(0, 1)
      }
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    input: {
      padding: theme.spacing(0, 1),
      marginLeft: 0,
      transition: theme.transitions.create('width'),
      height: 40,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '100%'
      }
    }
  })
);

type Props = {
  onSubmit: (value: string) => void;
  value?: string;
  placeholder?: string;
};

export default function SearchComponent({ value = '', placeholder = 'Search', onSubmit }: Props) {
  const classes = useStyles();

  const [search, setSearch] = React.useState(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    onSubmit(event.target.value);
  };

  const submitSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      setSearch('');
      onSubmit(search);
    }
  };

  return (
    <div className={classes.root}>
      <InputBase
        onKeyUp={submitSearch}
        value={search}
        onChange={handleChange}
        placeholder={`${placeholder}...`}
        classes={{
          input: classes.input
        }}
        inputProps={{
          'aria-label': 'search'
        }}
        endAdornment={<SearchIcon />}
      />
    </div>
  );
}
