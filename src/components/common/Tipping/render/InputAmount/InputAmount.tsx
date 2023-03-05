import React, { useEffect, useState } from 'react';

import { TextField } from '@material-ui/core';
import type { InputProps } from '@material-ui/core';

import { BN, BN_ZERO, BN_TEN, isBn } from '@polkadot/util';

import { useStyles } from './InputAmount.style';

import { formatBalance } from 'src/helpers/balance';
import { toBigNumber } from 'src/helpers/string';
import { CurrencyId } from 'src/interfaces/currency';
import i18n from 'src/locale';

type InputAmountProps = Omit<InputProps, 'onChange'> & {
  type?: string;
  defaultValue?: string | BN;
  maxValue?: BN | number;
  length?: number;
  fee?: BN;
  minBalance?: BN;
  decimal: number;
  currencyId: CurrencyId;
  onChange?: (value: BN, valid: boolean) => void;
  placeholder: string;
  minInput?: number;
};

export const InputAmount: React.FC<InputAmountProps> = props => {
  const {
    type = 'common',
    defaultValue,
    maxValue,
    fee = BN_ZERO,
    minBalance = BN_ZERO,
    decimal,
    length,
    currencyId,
    onChange,
    placeholder,
    minInput,
  } = props;

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

  // reset the input amount when changing currency
  useEffect(() => {
    setValid(true);

    if (!defaultValue) return;

    if (typeof defaultValue === 'string' && parseInt(defaultValue) > 0) {
      setValue(defaultValue.toString());
    } else if (isBn(defaultValue) && defaultValue.gt(BN_ZERO)) {
      const formatted = formatBalance(defaultValue, decimal);

      setValue(formatted);
    } else {
      setValue('');
    }
  }, [currencyId]);

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

  const validateInput = (values: string[]): [BN, boolean, string?] => {
    const multiplier = BN_TEN.pow(new BN(decimal - (values[1]?.length ?? 0)));
    const value = new BN(values.join('')).mul(multiplier);
    const amount = values.join('.');
    const balance = isBn(maxValue)
      ? maxValue
      : toBigNumber(maxValue.toString(), decimal);
    const maxTip = balance.sub(minBalance.gt(BN_ZERO) ? minBalance : fee);

    if (length && amount.length > length) {
      return [
        value,
        false,
        i18n.t('Tipping.Modal_Main.Error_Amount_Max', { length: length }),
      ];
    }

    if (value.lte(BN_ZERO)) {
      return [value, false, i18n.t('Tipping.Modal_Main.Error_Digit')];
    }

    if (maxTip && maxTip.lten(0)) {
      return [
        value,
        false,
        i18n.t('Tipping.Modal_Main.Error_Insufficient_Balance'),
      ];
    }

    if (maxTip && maxTip.gtn(0) && value.gt(maxTip)) {
      return [
        value,
        false,
        i18n.t('Tipping.Modal_Main.Error_Insufficient_Balance'),
      ];
    }

    if (Number(amount) < minInput) {
      return [
        value,
        false,
        i18n.t('Tipping.Modal_Main.Error_Insufficient_Balance'),
      ];
    }

    return [value, true];
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
