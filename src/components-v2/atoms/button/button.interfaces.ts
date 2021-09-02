enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

type ButtonSizeKey = keyof typeof ButtonSize;
type ButtonSizeValue = typeof ButtonSize[ButtonSizeKey];
const buttonSizes: ButtonSizeValue[] = Object.values(ButtonSize);

enum ButtonColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

type ButtonColorKey = keyof typeof ButtonColor;
type ButtonColorValue = typeof ButtonColor[ButtonColorKey];
const buttonColors: ButtonColorValue[] = Object.values(ButtonColor);

interface ButtonProps {
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
   * Button disabled?
   */
  isDisabled?: boolean;

  /**
   * Optional click handler
   */
  onClick?: () => void;
}

export {ButtonSize, ButtonColor, buttonSizes, buttonColors};
export type {ButtonProps};
