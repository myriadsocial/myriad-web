import React, { useEffect, useState } from 'react';

import { TextField } from '@material-ui/core';
import type { InputProps } from '@material-ui/core';

import { BN, BN_ZERO, BN_TEN } from '@polkadot/util';

import { useStyles } from './InputAmount.style';

import i18n from 'src/locale';

type InputAmountProps = Omit<InputProps, 'onChange'> & {
  type?: string;
  onChange?: (value: string, valid: boolean) => void;
  placeholder: string;
  decimal: number;
};

export const InputAmount: React.FC<InputAmountProps> = props => {
  const { type = 'common', onChange, placeholder, decimal } = props;

  const styles = useStyles();

  const [value, setValue] = useState<string>('');
  const [valid, setValid] = useState(true);
  const [error, setError] = useState<string>();
  const [dirty, setDirty] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      setValid(true);
      setValue('');
      setError(undefined);
    };
  }, []);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/,/gi, '');

    const values = value.split('.');
    if (values.length > 2) return;
    if (length && value.length > length) return;
    if (!value.match(/^[0-9]*\.?[0-9]*$/)) return;
    if (value[0] === '.') value = '0.';

    const [amount, valid, errorMessage] = validateInput(values);

    values[0] = (+values[0]).toLocaleString();

    setValue(values.join('.'));
    setValid(valid);
    setError(errorMessage);
    setDirty(true);

    onChange && onChange(amount, valid);
  };

  const handleInputWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;

    target.blur();
  };

  const validateInput = (values: string[]): [string, boolean, string?] => {
    const multiplier = BN_TEN.pow(new BN(decimal - (values[1]?.length ?? 0)));
    const value = new BN(values.join('')).mul(multiplier);
    const amount = values.join('.');

    if (value.lte(BN_ZERO)) {
      return [amount, false, i18n.t('Tipping.Modal_Main.Error_Digit')];
    }

    return [amount, true];
  };

  return (
    <>
      <TextField
        id="input-amount"
        classes={{
          root: type === 'common' ? styles.input : styles.inputExclusiveAmount,
        }}
        label={placeholder}
        type="text"
        variant="outlined"
        InputLabelProps={{ shrink: dirty }}
        inputProps={{ min: 0 }}
        value={value}
        error={!valid}
        onChange={handleAmountChange}
        onWheel={handleInputWheel}
        helperText={error}
      />
    </>
  );
};
