export enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum ButtonColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

export interface ButtonProps {
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
