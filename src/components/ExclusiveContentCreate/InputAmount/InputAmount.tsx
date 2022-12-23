import React, {useEffect, useState} from 'react';

import {TextField} from '@material-ui/core';
import type {InputProps} from '@material-ui/core';

import {BN_ZERO} from '@polkadot/util';

import {useStyles} from './InputAmount.style';

import {toBigNumber} from 'src/helpers/string';
import i18n from 'src/locale';

type InputAmountProps = Omit<InputProps, 'onChange'> & {
  type?: string;
  onChange?: (value: string, valid: boolean) => void;
  placeholder: string;
};

export const InputAmount: React.FC<InputAmountProps> = props => {
  const {type = 'common', onChange, placeholder} = props;

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
    const value = event.target.value;

    // remove invalid char and convert to dot formatted decimal
    const input = value.replace(/[^\d.,]+$/, '').replace(/,/, '.');

    const [amount, valid, errorMessage] = validateInput(input);

    setValue(input);
    setValid(valid);
    setError(errorMessage);
    setDirty(true);

    onChange && onChange(amount, valid);
  };

  const handleInputWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;

    target.blur();
  };

  const validateInput = (amount: string): [string, boolean, string?] => {
    const value = toBigNumber(amount, 1);

    if (value.lte(BN_ZERO)) {
      return [amount, false, i18n.t('Tipping.Modal_Main.Error_Digit')];
    }

    return [amount, true];
  };

  return (
    <>
      <TextField
        id="input-amount"
        classes={{root: type === 'common' ? styles.input : styles.inputExclusiveAmount}}
        label={placeholder}
        type="number"
        variant="outlined"
        InputLabelProps={{shrink: dirty}}
        inputProps={{min: 0}}
        value={value}
        error={!valid}
        onChange={handleAmountChange}
        onWheel={handleInputWheel}
        helperText={error}
      />
    </>
  );
};
