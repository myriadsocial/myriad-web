export const acronym = (value: string): string => {
  if (!value) return '';
  return value.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '');
};
