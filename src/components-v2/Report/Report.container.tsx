import React from 'react';

import {Report} from './Report';

import {useReport} from 'src/hooks/use-report.hook';
import {useToasterHook} from 'src/hooks/use-toaster.hook';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {Status} from 'src/interfaces/toaster';

type ReportContainerProps = {
  reference: Post | Comment | null;
  onClose: () => void;
};

export const ReportContainer: React.FC<ReportContainerProps> = props => {
  const {reference, onClose} = props;
  const isOpen = Boolean(reference);

  const {openToaster} = useToasterHook();
  const {sendReport} = useReport();

  const handleConfirmReport = (type: string, description: string) => {
    if (reference) {
      sendReport(reference, type, description);
    }

    onClose();
    openToaster({
      message: 'Post report has been submitted',
      toasterStatus: Status.SUCCESS,
    });
  };

  if (!reference) return null;

  return (
    <Report open={isOpen} reference={reference} onClose={onClose} onConfirm={handleConfirmReport} />
  );
};
