import {useContext} from 'react';

import {ReportContext, HandleReport} from './Report.context';

const useReport = (): HandleReport => {
  const report = useContext(ReportContext);

  if (!report) {
    throw new Error('useReport must be used within a ConfirmProvider');
  }

  return report;
};

export default useReport;
