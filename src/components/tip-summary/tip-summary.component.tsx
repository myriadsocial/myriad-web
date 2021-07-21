import React, {useEffect, useState} from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import {useTipSummaryHook} from './tip-summar.hook';
import {useStyles} from './tip-summary.style';
import {useTransactionHistory} from './use-transaction-history.hooks';

import DialogTitle from 'src/components/common/DialogTitle.component';
import {useToken} from 'src/components/wallet/token.context';
import {timeAgo} from 'src/helpers/date';
import {formatTipBalance, getTipperUserName} from 'src/helpers/transaction';

export const TipSummaryComponent: React.FC = () => {
  const styles = useStyles();

  const {
    state: {userTokens},
  } = useToken();

  const {post, clearTipSummary} = useTipSummaryHook();
  const {postDetail, transactions, loadTransaction} = useTransactionHistory();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (post) {
      loadTransaction(post);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [post]);

  const toggleOpen = () => {
    setOpen(!open);

    if (open) {
      clearTipSummary();
    }
  };

  if (!postDetail) return null;

  return (
    <div>
      <Dialog open={open} maxWidth="md" onClose={close}>
        <DialogTitle onClose={toggleOpen} id="tip-summary">
          Tip Received
        </DialogTitle>
        <DialogContent className={styles.root}>
          <Typography variant="h5" style={{marginTop: 8, marginBottom: 24}}>
            This post has received:
          </Typography>

          <TableContainer component={Paper}>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Currency</TableCell>
                  <TableCell align="right">Total Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {postDetail.tipsReceived &&
                  postDetail.tipsReceived.map((tip, i) => (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">
                        {tip.tokenId}
                      </TableCell>
                      <TableCell align="right">{formatTipBalance(tip, userTokens)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="caption" style={{marginTop: 24, marginBottom: 16}} component="div">
            Tipper list ({transactions.length})
          </Typography>
          <List className={styles.list}>
            {transactions.map(transaction => (
              <ListItem key={transaction.trxHash}>
                <ListItemAvatar>
                  <Avatar
                    alt={getTipperUserName(transaction)}
                    src={transaction.fromUser?.profilePictureURL}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={`${getTipperUserName(transaction)} tipped ${transaction.value} ${
                    transaction.tokenId
                  }`}
                  secondary={timeAgo(transaction.createdAt)}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions className={styles.done}>
          <Button
            onClick={toggleOpen}
            size="large"
            variant="contained"
            color="primary"
            style={{width: 200}}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TipSummaryComponent;
