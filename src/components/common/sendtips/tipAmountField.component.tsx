import React from 'react';

import TextField from '@material-ui/core/TextField';

interface Props {
  value: string;
  isError: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldLabel: string;
  helperTextField: string;
}

export const TipAmountFieldComponent = ({
  onChange,
  value,
  isError,
  fieldLabel,
  helperTextField,
}: Props) => {
  return (
    <form noValidate autoComplete="off">
      <TextField
        value={value}
        onChange={onChange}
        required
        error={isError}
        id="sendTipAmount"
        label={fieldLabel}
        helperText={helperTextField}
        variant="outlined"
      />
    </form>
  );
};
