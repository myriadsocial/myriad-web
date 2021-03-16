import React from 'react';
import { makeStyles, createStyles, fade, Theme } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
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
        margin: theme.spacing(1),
        width: 'auto'
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
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      marginLeft: 0,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch'
        }
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
  };

  const submitSearch = event => {
    if (event.keyCode === 13) {
      setSearch('');
      onSubmit(search);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        onKeyUp={submitSearch}
        value={search}
        onChange={handleChange}
        placeholder={`${placeholder}...`}
        classes={{
          input: classes.input
        }}
        inputProps={{ 'aria-label': 'search' }}
      />
    </div>
  );
}
