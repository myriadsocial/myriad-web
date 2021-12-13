import React from 'react';

import {Report} from './Report';

import {useReport} from 'src/hooks/use-report.hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';

type ReportContainerProps = {
  reference: Post | Comment | null;
  onClose: () => void;
};

export const ReportContainer: React.FC<ReportContainerProps> = props => {
  const {reference, onClose} = props;
  const isOpen = Boolean(reference);

  const {openToasterSnack} = useToasterSnackHook();
  const {sendReport} = useReport();

  const handleConfirmReport = (type: string, description: string) => {
    if (reference) {
      sendReport(reference, type, description);
    }

    onClose();
    openToasterSnack({
      message: 'Post report has been submitted',
      variant: 'success',
    });
  };

  if (!reference) return null;

  return (
    <Report open={isOpen} reference={reference} onClose={onClose} onConfirm={handleConfirmReport} />
  );
};
