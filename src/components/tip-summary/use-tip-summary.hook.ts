import {useSelector, useDispatch} from 'react-redux';

import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {Transaction, TransactionDetail} from 'src/interfaces/transaction';
import {ListMeta} from 'src/lib/api/interfaces/base-list.interface';
import {RootState} from 'src/reducers';
import {
  setTippedReference,
  clearTippedContent,
  fetchTransactionHistory,
  fetchTransactionSummary,
  fetchTransactionHistoryForComment,
  fetchTransactionSummaryForComment,
} from 'src/reducers/tip-summary/actions';
import {TipSummaryState} from 'src/reducers/tip-summary/reducer';

type TipSummaryHookProps = {
  meta: ListMeta;
  show: boolean;
  post: Post | null;
  comment: Comment | null;
  transactions: Transaction[];
  summary: TransactionDetail[];
  loadTransaction: (post: Post, page?: number) => void;
  loadNextTransaction: (post: Post) => void;
  openTipSummary: (post: Post) => void;
  loadTransactionForComment: (comment: Comment, page?: number) => void;
  loadNextTransactionForComment: (comment: Comment) => void;
  openTipSummaryForComment: () => void;
  clearTipSummary: () => void;
};

export const useTipSummaryHook = (): TipSummaryHookProps => {
  const dispatch = useDispatch();

  const {loading, reference, show, summary, transactions, meta} = useSelector<
    RootState,
    TipSummaryState
  >(state => state.tipSummaryState);

  const openTipSummary = (post: Post): void => {
    dispatch(setTippedReference(post));
    dispatch(fetchTransactionSummary(post));
  };

  const loadNextTransaction = async (post: Post): Promise<void> => {
    if (!loading) {
      await loadTransaction(post, meta.currentPage + 1);
    }
  };

  const loadTransaction = async (post: Post, page?: number): Promise<void> => {
    const currentPage = page ? page : meta.currentPage;

    dispatch(fetchTransactionHistory(post, 'post', currentPage));
  };

  const openTipSummaryForComment = (): void => {
    dispatch(fetchTransactionSummaryForComment());
  };

  const loadNextTransactionForComment = async (comment: Comment): Promise<void> => {
    if (!loading) {
      await loadTransactionForComment(comment, meta.currentPage + 1);
    }
  };

  const loadTransactionForComment = async (comment: Comment, page?: number): Promise<void> => {
    const currentPage = page ? page : meta.currentPage;

    dispatch(fetchTransactionHistoryForComment(comment, currentPage));
  };

  const clearTipSummary = (): void => {
    dispatch(clearTippedContent());
  };

  return {
    meta,
    show,
    post: reference && 'platform' in reference ? reference : null,
    comment: reference && 'platform' in reference ? null : reference,
    summary,
    transactions,
    loadTransaction,
    loadNextTransaction,
    openTipSummary,
    loadTransactionForComment,
    loadNextTransactionForComment,
    openTipSummaryForComment,
    clearTipSummary,
  };
};
