import React, {useState} from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
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
import {Currency} from 'src/interfaces/currency';

interface Props {
  balanceDetails: BalanceDetail[];
  isLoading: boolean;
  availableTokens: Currency[];
  onChange: (wsAddress: string, tokenDecimals: number, tokenId: string) => void;
}

export const CurrencyTableComponent = ({
  isLoading,
  availableTokens,
  balanceDetails,
  onChange,
}: Props) => {
  const styles = useStyles();
  const [selectedToken, setSelectedToken] = useState('');

  const handleSetSelectedToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    const clickedToken = (event.target as HTMLInputElement).value;
    setSelectedToken(clickedToken);

    availableTokens.forEach(token => {
      if (token.id === clickedToken) {
        onChange(token.rpcURL, token.decimal, token.id);
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
          {balanceDetails.length === 0 && (
            <TableRow key={'loading-row'}>
              <TableCell colSpan={2}>
                <CircularProgress className={styles.spinner} size={16} />
              </TableCell>
            </TableRow>
          )}
          {balanceDetails.map(row => (
            <TableRow key={row.id}>
              <RadioGroup
                aria-label="token"
                name={selectedToken}
                value={selectedToken}
                onChange={handleSetSelectedToken}>
                <TableCell component="th" scope="row">
                  {row.id === 'MYRIA' ? (
                    <></>
                  ) : (
                    <>
                      <FormControlLabel value={row.id} control={<Radio />} label={row.id} />
                    </>
                  )}
                </TableCell>
              </RadioGroup>
              <TableCell align="right">
                {row.id === 'MYRIA' ? (
                  <></>
                ) : isLoading ? (
                  <CircularProgress className={styles.spinner} size={20} />
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
