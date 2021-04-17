import React, { useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
    },
    textField: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      color: theme.palette.text.secondary,
      fontSize: 30,
      opacity: 1,
      borderBottom: 0,
      '&:before': {
        borderBottom: 0
      }
    },
    disabled: {
      color: theme.palette.text.disabled,
      borderBottom: 0,
      '&:before': {
        borderBottom: 0
      }
    },
  })
);

type Props = {
  name: string;
  value: string;
  multiline?:boolean;
  rows?:number;
  onChange: (value: string) => void;
};

export const EditableTextField = ({ onChange, value, name, multiline, rows }: Props) => {
  const styles = useStyles();

  const [isEditMode, setEditMode] = useState(false);
  const [isMouseOver, setMouseover] = useState(false);

  const editField = () => {
    setEditMode(true);
    setMouseover(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditMode(false);
    setMouseover(false);
    onChange(event.target.value);
  };

  const handleMouseOver = () => {
    setMouseover(true);
  };

  const handleMouseOut = () => {
    setMouseover(false);
  };

  return (
    <div className={styles.root}>
      <TextField
        fullWidth
        multiline={multiline}
        rows={rows}
        name={name}
        defaultValue={value}
        margin="none"
        onChange={handleChange}
        disabled={!isEditMode}
        className={styles.textField}
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseOut}
        InputProps={{
          classes: {
            disabled: styles.disabled
          },
          endAdornment: isMouseOver ? (
            <InputAdornment position="end">
              <IconButton onClick={editField}>
                <Edit />
              </IconButton>
            </InputAdornment>
          ) : (
            ''
          )
        }}
      />
    </div>
  );
};
