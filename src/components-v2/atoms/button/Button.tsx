import React from 'react';

import MuiButton from '@material-ui/core/Button';

import {ButtonSize, ButtonColor, ButtonVariant, ButtonProps} from './button.interfaces';

const Button: React.FC<ButtonProps> = props => {
  const {
    color = ButtonColor.PRIMARY,
    size = ButtonSize.MEDIUM,
    ariaLabel = 'contained-button',
    variant = ButtonVariant.CONTAINED,
    children,
    isDisabled = false,
    ...restProps
  } = props;
  return (
    <MuiButton
      color={color}
      size={size}
      aria-label={ariaLabel}
      disabled={isDisabled}
      variant={variant}
      {...restProps}>
      {children}
    </MuiButton>
  );
};

export default Button;
