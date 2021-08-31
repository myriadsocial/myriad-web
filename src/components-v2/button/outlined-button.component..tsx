import React from 'react';

import Button from '@material-ui/core/Button';

import {useStyles} from './outlined-button.style';

interface ButtonProps {
  color?: 'primary' | 'secondary' | 'default';
  size?: 'small' | 'medium' | 'large';
  isCancel?: boolean;
  label: string;
  onClick?: () => void;
}

export const OutlinedButton = ({
  size = 'medium',
  color = 'default',
  label,
  isCancel = false,
  ...props
}: ButtonProps) => {
  const styles = useStyles();
  const mode = isCancel ? styles['button-cancel'] : '';
  return (
    <Button
      variant="outlined"
      size={size}
      color={color}
      className={[styles.button, mode].join(' ')}
      {...props}>
      {label}
    </Button>
  );
};
