import millify from 'millify';

export const formatCount = (value: number) => {
  return millify(value, {
    precision: 1,
    lowercase: true,
  });
};
