import millify from 'millify';

export const formatCount = (value: number) => {
  return millify(value, {
    precision: 1,
    lowercase: true,
  });
};

export const parseScientificNotatedNumber = (input: number): string | null => {
  let result: string | null = null;
  const parsedInput = input.toString().split('-')[1];

  if (parsedInput) result = input.toFixed(Number(parsedInput));

  if (parsedInput === undefined) result = input.toFixed(4);

  return result;
};
