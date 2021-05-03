import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles, createStyles, fade, Theme } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      display: 'inline-block',
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
      paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
      marginLeft: 0,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '16ch',
        '&:focus': {
          width: '24ch'
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

export default function AddTagComponent({ value = '', placeholder = 'Search', onSubmit }: Props) {
  const classes = useStyles();

  const [text, setText] = React.useState(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const submitSearch = () => {
    onSubmit(text);
    setText('');
  };

  return (
    <div className={classes.root}>
      <InputBase
        value={text}
        onChange={handleChange}
        placeholder={`${placeholder}...`}
        classes={{
          input: classes.input
        }}
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton color="default" aria-label="add tags" onClick={submitSearch}>
        <AddCircleIcon />
      </IconButton>
    </div>
  );
}
