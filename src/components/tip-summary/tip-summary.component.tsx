import React, {useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
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

import {useStyles} from './tip-summary.style';
import {useTipSummaryHook} from './use-tip-summary.hook';

import {AvatarComponent} from 'src/components/common/Avatar.component';
import DialogTitle from 'src/components/common/DialogTitle.component';
import {timeAgo} from 'src/helpers/date';
import {acronym} from 'src/helpers/string';
import {getTipperUserName} from 'src/helpers/transaction';

export const TipSummaryComponent: React.FC = () => {
  const styles = useStyles();

  const {
    meta,
    show,
    post,
    comment,
    summary,
    transactions,
    clearTipSummary,
    loadTransaction,
    loadNextTransaction,
    loadTransactionForComment,
    loadNextTransactionForComment,
  } = useTipSummaryHook();

  useEffect(() => {
    if (post?.id) {
      loadTransaction(post);
    }
  }, [post?.id]);

  useEffect(() => {
    if (comment?.id) {
      loadTransactionForComment(comment);
    }
  }, [comment?.id]);

  const nextPage = () => {
    if (post) {
      loadNextTransaction(post);
    }
  };

  const nextPageCommentTransaction = () => {
    if (comment) {
      loadNextTransactionForComment(comment);
    }
  };

  const toggleClose = () => {
    clearTipSummary();
  };

  if (!post && !comment) return null;

  return (
    <div>
      <Dialog open={show} maxWidth="md" onClose={close}>
        <DialogTitle onClose={toggleClose} id="tip-summary">
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
                {summary.map((transaction, i) => (
                  <TableRow key={i}>
                    <TableCell component="th" scope="row">
                      {transaction.currencyId}
                    </TableCell>
                    <TableCell align="right">{transaction.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="caption" style={{marginTop: 24, marginBottom: 16}} component="div">
            Tipper list ({meta.totalItemCount})
          </Typography>
          <List className={styles.list} id="scrollable-transaction">
            <InfiniteScroll
              scrollableTarget="scrollable-transaction"
              dataLength={transactions.length}
              next={post && !comment ? nextPage : nextPageCommentTransaction}
              hasMore={meta.currentPage < meta.totalPageCount}
              loader={
                <ListItem>
                  <CircularProgress color="primary" size={24} style={{margin: '0 auto'}} />
                </ListItem>
              }>
              {transactions.map(transaction => (
                <ListItem key={transaction.hash}>
                  <ListItemAvatar>
                    <AvatarComponent
                      alt={getTipperUserName(transaction)}
                      src={transaction.fromUser?.profilePictureURL}>
                      {acronym(transaction.fromUser?.name)}
                    </AvatarComponent>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${getTipperUserName(transaction)} tipped ${transaction.amount} ${
                      transaction.currencyId
                    }`}
                    secondary={timeAgo(transaction.createdAt)}
                  />
                </ListItem>
              ))}
            </InfiniteScroll>
          </List>
        </DialogContent>
        <DialogActions className={styles.done}>
          <Button
            onClick={toggleClose}
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
