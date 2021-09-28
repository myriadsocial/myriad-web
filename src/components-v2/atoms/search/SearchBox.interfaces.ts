enum SearchBoxColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

type SearchBoxColorKey = keyof typeof SearchBoxColor;
type SearchBoxColorValue = typeof SearchBoxColor[SearchBoxColorKey];
const searchBoxColors: SearchBoxColorValue[] = Object.values(SearchBoxColor);

interface SearchBoxProps {
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
  isDisabled?: boolean;

  onSubmit: (value: string) => void;
}

export {SearchBoxColor, searchBoxColors};
export type {SearchBoxProps};
