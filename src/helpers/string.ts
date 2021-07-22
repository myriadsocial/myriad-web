export const acronym = (value: string): string => {
  if (!value) return '';
  return value.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '');
};

export const capitalize = (text: string): string => {
  const word = text.toLowerCase();

  return word[0].toUpperCase() + word.substring(1);
};
