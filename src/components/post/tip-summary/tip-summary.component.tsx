import React, { useEffect, forwardRef, useState, useImperativeHandle } from 'react';

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

import { useStyles } from './tip-summary.style';
import { usePostTransactionHistory } from './use-post-transaction-history.hooks';

import DialogTitle from 'src/components/common/DialogTitle.component';
import { timeAgo } from 'src/helpers/date';
import { Post } from 'src/interfaces/post';
import { Transaction } from 'src/interfaces/transaction';

type TipSummaryComponentProps = {
  open: boolean;
  close: () => void;
  post: Post;
};

const UNKNOWN_ACCOUNT = 'unknown';
//const TRANSACTION_DIVIDER = 1000000000000;

export const TipSummaryComponent = ({ open, close, post }: TipSummaryComponentProps) => {
  const styles = useStyles();

  const { postDetail, transactions, loadTransaction } = usePostTransactionHistory(post);

  useEffect(() => {
    loadTransaction();
  }, []);

  const getTippingUserName = (transaction: Transaction): string => {
    if (transaction.from === UNKNOWN_ACCOUNT || !transaction.fromUser) {
      return 'Anonymous user';
    }

    return transaction.fromUser.name;
  };

  if (!post) return null;

  return (
    <div>
      <Dialog open={open} maxWidth="md" onClose={close}>
        <DialogTitle onClose={close} id="tip-summary">
          Tip Received
        </DialogTitle>
        <DialogContent className={styles.root}>
          <Typography variant="h5" style={{ marginTop: 8, marginBottom: 24 }}>
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
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {tip.tokenId}
                      </TableCell>
                      <TableCell align="right">{tip.totalTips}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="caption" style={{ marginTop: 24, marginBottom: 16 }} component="div">
            Tipper list ({transactions.length})
          </Typography>
          <List className={styles.list}>
            {transactions.map(transaction => (
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt={getTippingUserName(transaction)} src={transaction.fromUser?.profilePictureURL} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${getTippingUserName(transaction)} tipped ${transaction.value} ${transaction.tokenId}`}
                  secondary={timeAgo(transaction.createdAt)}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions className={styles.done}>
          <Button onClick={close} size="large" variant="contained" color="primary" style={{ width: 200 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
