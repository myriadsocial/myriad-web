export const acronym = (value: string): string => {
  return value.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '');
};
