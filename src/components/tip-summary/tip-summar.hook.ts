import {useTipSummary, TipSummaryActionType} from 'src/components/tip-summary/tip-summary.context';
import {Post} from 'src/interfaces/post';

type TipSummaryHookProps = {
  post: Post | null;
  openTipSummary: (post: Post) => void;
  clearTipSummary: () => void;
};

export const useTipSummaryHook = (): TipSummaryHookProps => {
  const {
    state: {post},
    dispatch,
  } = useTipSummary();

  const openTipSummary = (post: Post): void => {
    dispatch({
      type: TipSummaryActionType.SET_TIPPED_POST,
      payload: post,
    });
  };

  const clearTipSummary = (): void => {
    dispatch({
      type: TipSummaryActionType.CLEAR_TIPPED_POST,
    });
  };

  return {
    post,
    openTipSummary,
    clearTipSummary,
  };
};
