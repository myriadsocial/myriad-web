import {useContext} from 'react';

import {TipHistoryContext, HandleTipHistory} from './TipHistory.context';

const useTipHistoryHook = (): HandleTipHistory => {
  const tipHistory = useContext(TipHistoryContext);

  if (!tipHistory) {
    throw new Error('useTipHistoryHook must be used within a ConfirmProvider');
  }

  return tipHistory;
};

export default useTipHistoryHook;
