import { useTipSummary, TipSummaryActionType } from 'src/components/tip-summary/tip-summary.context';
import { Post } from 'src/interfaces/post';

export const useTipSummaryHook = () => {
  const { dispatch } = useTipSummary();

  const openTipSummary = (post: Post) => {
    dispatch({
      type: TipSummaryActionType.SET_TIPPED_POST,
      payload: post
    });
  };

  return {
    openTipSummary
  };
};
