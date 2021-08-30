import React from 'react';

import MuiButton from '@material-ui/core/Button';

import useStyles from './Button.style';

export enum ButtonMode {
  primary = 'primary',
  secondary = 'secondary',
}

interface ButtonProps {
  mode: ButtonMode;

  size: 'small' | 'medium' | 'large';

  onClick: () => void;

  label: string;
}

const Button: React.FC<ButtonProps> = ({mode, size, onClick, label}) => {
  const styles = useStyles();

  if (mode === ButtonMode.secondary)
    return <MuiButton className={styles.buttonSecondary}>{label}</MuiButton>;

  return <MuiButton className={styles.buttonPrimary}>{label}</MuiButton>;
};

export default Button;
