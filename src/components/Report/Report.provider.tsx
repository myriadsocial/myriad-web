import React, {useCallback, useState} from 'react';

import {Report} from './Report';
import {ReportContext} from './Report.context';

import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';

export const ReportProvider: React.ComponentType = ({children}) => {
  const [reference, setReference] = useState<Post | Comment>(null);

  const openReportDialog = useCallback((reference: Post | Comment) => {
    setReference(reference);
  }, []);

  const closeReport = useCallback(() => {
    setReference(null);
  }, []);

  const handleConfirmReport = useCallback(() => {
    setReference(null);
  }, []);

  return (
    <>
      <ReportContext.Provider value={{reference, open: openReportDialog}}>
        {children}
      </ReportContext.Provider>

      {reference && (
        <Report
          open={Boolean(reference)}
          reference={reference}
          onClose={closeReport}
          onConfirm={handleConfirmReport}
        />
      )}
    </>
  );
};
