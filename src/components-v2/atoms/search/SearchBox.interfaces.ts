enum InputBaseColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

type InputBaseColorKey = keyof typeof InputBaseColor;
type InputBaseColorValue = typeof InputBaseColor[InputBaseColorKey];
const inputBaseColors: InputBaseColorValue[] = Object.values(InputBaseColor);

interface InputBaseProps {
  /**
   * Define the base color of the InputBase
   */
  color?: InputBaseColor;

  /**
   * InputBase accessibility label
   */
  ariaLabel?: string;

  /**
   * Button label
   */
  placeholder: string;

  /**
   * InputBase disabled?
   */
  isDisabled?: boolean;
}

export {InputBaseColor, inputBaseColors};
export type {InputBaseProps};
