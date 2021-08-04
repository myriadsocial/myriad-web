import {useSelector, useDispatch} from 'react-redux';

import {Post} from 'src/interfaces/post';
import {RootState} from 'src/reducers';
import {setTippedPost, clearTippedPost} from 'src/reducers/tip-summary/actions';
import {TipSummaryState} from 'src/reducers/tip-summary/reducer';

type TipSummaryHookProps = {
  post: Post | null;
  openTipSummary: (post: Post) => void;
  clearTipSummary: () => void;
};

export const useTipSummaryHook = (): TipSummaryHookProps => {
  const dispatch = useDispatch();

  const {post} = useSelector<RootState, TipSummaryState>(state => state.tipSummaryState);

  const openTipSummary = (post: Post): void => {
    dispatch(setTippedPost(post));
  };

  const clearTipSummary = (): void => {
    dispatch(clearTippedPost());
  };

  return {
    post,
    openTipSummary,
    clearTipSummary,
  };
};
