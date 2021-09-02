import {action} from '@storybook/addon-actions';

import React from 'react';

import Button from '@material-ui/core/Button';

import {ButtonSize, ButtonColor, ButtonProps} from './button.interfaces';

const ContainedButton = ({
  color = ButtonColor.PRIMARY,
  size = ButtonSize.MEDIUM,
  ariaLabel = 'contained-button',
  children,
  isDisabled = false,
  ...props
}: ButtonProps): JSX.Element => {
  return (
    <Button
      color={color}
      size={size}
      aria-label={ariaLabel}
      disabled={isDisabled}
      variant="contained"
      onClick={action('clicked')}>
      {children}
    </Button>
  );
};

export default ContainedButton;
