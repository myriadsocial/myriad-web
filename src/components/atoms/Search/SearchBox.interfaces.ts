enum SearchBoxColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

type SearchBoxColorKey = keyof typeof SearchBoxColor;
type SearchBoxColorValue = typeof SearchBoxColor[SearchBoxColorKey];
const searchBoxColors: SearchBoxColorValue[] = Object.values(SearchBoxColor);

type SearchBoxProps = {
  /**
   * Define the base color of the SearchBox
   */
  color?: SearchBoxColor;

  /**
   * SearchBox accessibility label
   */
  ariaLabel?: string;

  /**
   * Button label
   */
  placeholder?: string;

  /**
   * SearchBox disabled?
   */
  outlined?: boolean;

  onSubmit?: (value: string) => void;
  iconPosition?: 'start' | 'end';
};

export {SearchBoxColor, searchBoxColors};
export type {SearchBoxProps};
