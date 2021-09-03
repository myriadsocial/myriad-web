import React from 'react';

import MuiButton from '@material-ui/core/Button';

import {ButtonSize, ButtonColor, ButtonVariant, ButtonProps} from './button.interfaces';

const Button = ({
  color = ButtonColor.PRIMARY,
  size = ButtonSize.MEDIUM,
  ariaLabel = 'contained-button',
  variant = ButtonVariant.CONTAINED,
  children,
  isDisabled = false,
  ...props
}: ButtonProps): JSX.Element => {
  return (
    <MuiButton
      color={color}
      size={size}
      aria-label={ariaLabel}
      disabled={isDisabled}
      variant={variant}
      {...props}>
      {children}
    </MuiButton>
  );
};

export default Button;
