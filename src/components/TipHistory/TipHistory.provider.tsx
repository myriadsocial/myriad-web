import React, {useCallback, useState} from 'react';

import TipHistoryContainer from './TipHistory.container';
import {TipHistoryContext} from './TipHistory.context';

import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

export const TipHistoryProvider: React.ComponentType = ({children}) => {
  const [reference, setReference] = useState<Post | Comment | User>(null);
  const [referenceType, setReferenceType] = useState<ReferenceType>(ReferenceType.POST);

  const openTipHistory = useCallback((reference: Post | Comment | User) => {
    setReference(reference);

    let type = ReferenceType.POST;

    if ('username' in reference) type = ReferenceType.USER;
    if ('section' in reference) type = ReferenceType.COMMENT;

    setReferenceType(type);
  }, []);

  const closeTipHistory = useCallback(() => {
    setReference(null);
  }, []);

  return (
    <>
      <TipHistoryContext.Provider value={{reference, open: openTipHistory}}>
        {children}
      </TipHistoryContext.Provider>

      {reference && (
        <TipHistoryContainer
          reference={reference}
          referenceType={referenceType}
          onClose={closeTipHistory}
        />
      )}
    </>
  );
};
