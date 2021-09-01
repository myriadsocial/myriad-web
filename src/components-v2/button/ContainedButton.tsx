import React from 'react';

import Button from '@material-ui/core/Button';

import {ButtonSize, ButtonColor} from './ContainedButton-interfaces';

interface ContainedButtonProps {
  /**
   * Define the base color of the button
   */
  color?: ButtonColor;

  /**
   * How large should the button be?
   */
  size?: ButtonSize;

  /**
   * Button accessibility label
   */
  ariaLabel?: string;

  /**
   * Button label
   */
  children: React.ReactNode;

  /**
   * Optional click handler
   */
  onClick?: () => void;
}

const ContainedButton = ({
  color = ButtonColor.PRIMARY,
  size = ButtonSize.MEDIUM,
  ariaLabel = 'contained-button',
  children,
  ...props
}: ContainedButtonProps): JSX.Element => {
  return (
    <Button color={color} size={size} aria-label={ariaLabel} variant="contained">
      {children}
    </Button>
  );
};

export default ContainedButton;
