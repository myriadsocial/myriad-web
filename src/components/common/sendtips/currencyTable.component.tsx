import React, {useState} from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import {TableCell, useStyles} from './send-tips.style';

import {BalanceDetail} from 'src/interfaces/balance';
import {Token} from 'src/interfaces/token';

interface Props {
  balanceDetails: BalanceDetail[];
  availableTokens: Token[];
  onChange: (wsAddress: string, tokenDecimals: number, tokenId: string) => void;
}

export const CurrencyTableComponent = ({availableTokens, balanceDetails, onChange}: Props) => {
  const styles = useStyles();
  const [selectedToken, setSelectedToken] = useState('');

  const handleSetSelectedToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    const clickedToken = (event.target as HTMLInputElement).value;
    setSelectedToken(clickedToken);

    availableTokens.forEach(token => {
      if (token.id === clickedToken) {
        onChange(token.rpc_address, token.token_decimal, token.id);
      }
    });
  };

  return (
    <TableContainer>
      <Table size="small" aria-label="balance-table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography className={styles.balanceText}>Currency Selection</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography className={styles.balanceText}>Your Balance</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {balanceDetails.map(row => (
            <TableRow key={row.tokenSymbol}>
              <RadioGroup
                aria-label="token"
                name={selectedToken}
                value={selectedToken}
                onChange={handleSetSelectedToken}>
                <TableCell component="th" scope="row">
                  {row.tokenSymbol === 'MYRIA' ? (
                    <></>
                  ) : (
                    <>
                      <FormControlLabel
                        value={row.tokenSymbol}
                        control={<Radio />}
                        label={row.tokenSymbol}
                      />
                    </>
                  )}
                </TableCell>
              </RadioGroup>
              <TableCell align="right">
                {row.tokenSymbol === 'MYRIA' ? (
                  <></>
                ) : (
                  <Typography className={styles.balanceText}>{row.freeBalance}</Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
