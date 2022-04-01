import React, {useEffect, useState} from 'react';

import {OutlinedInput, FormHelperText} from '@material-ui/core';
import type {InputProps} from '@material-ui/core';

import {BN, BN_TEN, BN_ZERO, isBn} from '@polkadot/util';

import {useStyles} from './InputAmount.style';

type InputAmountProps = Omit<InputProps, 'onChange'> & {
  defaultValue?: string | BN;
  maxValue: BN | number;
  fee?: BN;
  decimal: number;
  onChange?: (value: BN, valid: boolean) => void;
};

export const InputAmount: React.FC<InputAmountProps> = props => {
  const {defaultValue, maxValue, fee = BN_ZERO, decimal, onChange, ...inputProps} = props;

  const styles = useStyles();

  const [value, setValue] = useState<string>('');
  const [valid, setValid] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!defaultValue) return;

    if (typeof defaultValue === 'string') {
      setValue(defaultValue);
    }

    if (isBn(defaultValue) && defaultValue.gt(BN_ZERO)) {
      setValue(value.toString());
    } else {
      setValue('');
    }

    return () => {
      setValue('');
    };
  }, [defaultValue]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // remove invalid char
    const input = value.replace(/[^\d.]+$/, '');

    const amount = toBigNumber(input);
    const [valid, errorMessage] = isValidNumber(amount);

    setValue(input);
    setValid(valid);
    setError(errorMessage);

    onChange && onChange(amount, valid);
  };

  const handleInputWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;

    target.blur();
  };

  const toBigNumber = (value: string) => {
    let result: BN;

    const isDecimalValue = value.match(/^(\d+)\.(\d+)$/);

    if (isDecimalValue) {
      const div = new BN(value.replace(/\.\d*$/, ''));
      const modString = value.replace(/^\d+\./, '').substr(0, decimal);
      const mod = new BN(modString);

      result = div
        .mul(BN_TEN.pow(new BN(decimal)))
        .add(mod.mul(BN_TEN.pow(new BN(decimal - modString.length))));
    } else {
      result = new BN(value).mul(BN_TEN.pow(new BN(decimal)));
    }

    return result;
  };

  const isValidNumber = (value: BN): [boolean, string?] => {
    const balance = isBn(maxValue) ? maxValue : toBigNumber(maxValue.toString());
    const maxTip = balance.sub(fee);

    if (value.lte(BN_ZERO)) {
      return [false, 'Digit only'];
    }

    if (maxTip && maxTip.lten(0)) {
      return [false, 'Insufficient balance'];
    }

    if (maxTip && maxTip.gtn(0) && value.gt(maxTip)) {
      return [false, 'Insufficient balance'];
    }

    return [true];
  };

  return (
    <>
      <OutlinedInput
        id="input-amount"
        classes={{root: styles.input}}
        type="number"
        value={value}
        error={!valid}
        onChange={handleAmountChange}
        onWheel={handleInputWheel}
        {...inputProps}
      />
      <FormHelperText style={{alignSelf: 'center'}}>{error}</FormHelperText>
    </>
  );
};
