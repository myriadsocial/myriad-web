import React, { useState, useRef } from 'react';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Clear from '@material-ui/icons/Clear';
import Edit from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexDirection: 'row'
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
    inlineButtonsLayout: {
      flexDirection: 'row',
      marginBottom: '4px'
    },
    cancelButton: {
      color: 'red',
      justifyContent: 'space-around'
    },
    confirmButton: {
      backgroundColor: '#A942E9',
      color: 'white',
      justifyContent: 'space-around'
    }
  })
);

type Props = {
  name: string;
  value: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  style?: React.CSSProperties;
  onChange: (value: string) => void;
};

export const EditableTextField = ({ onChange, value, name, multiline, rows, fullWidth = false, style }: Props) => {
  const styles = useStyles();

  const formRef = useRef<HTMLFormElement | null>(null);

  const [isEditMode, setEditMode] = useState(false);
  const [isMouseOver, setMouseover] = useState(false);
  const [defaultValue, setDefaultValue] = useState(value);
  const [newValue, setNewValue] = useState('');

  const editField = () => {
    setEditMode(true);
    setMouseover(false);
  };

  const cancelEditField = () => {
    setEditMode(false);
    setMouseover(true);
    formRef?.current?.reset();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEditMode(false);
    setMouseover(false);
    setDefaultValue(newValue);
    onChange(newValue);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(event.target.value);
  };

  //const updateProfile = () => {
  ////if (event.keyCode == 13) {
  //onChange(defaultValue);

  //setEditMode(false);
  //setMouseover(false);
  ////}
  //};

  const handleMouseOver = () => {
    setMouseover(true);
  };

  const handleMouseOut = () => {
    setMouseover(false);
  };

  return (
    <div className={styles.root}>
      <form onSubmit={handleSubmit} ref={formRef}>
        <TextField
          fullWidth={fullWidth}
          multiline={multiline}
          rows={rows}
          name={name}
          defaultValue={defaultValue}
          margin="none"
          onChange={handleChange}
          disabled={!isEditMode}
          className={styles.textField}
          onMouseEnter={handleMouseOver}
          onMouseLeave={handleMouseOut}
          //onKeyDown={updateProfile}
          InputProps={{
            style,
            classes: {
              disabled: styles.disabled
            },
            endAdornment: isMouseOver ? (
              <InputAdornment position="start">
                {isEditMode === true ? (
                  <div className={styles.inlineButtonsLayout}>
                    <Button type="submit" value="Submit" className={styles.confirmButton}>
                      {' '}
                      Confirm{' '}
                    </Button>
                    <IconButton onClick={cancelEditField}>
                      <Clear className={styles.cancelButton} />
                    </IconButton>
                  </div>
                ) : (
                  <IconButton onClick={editField}>
                    <Edit />
                  </IconButton>
                )}
              </InputAdornment>
            ) : (
              ''
            )
          }}
        />
      </form>
    </div>
  );
};
