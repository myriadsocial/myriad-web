import React from 'react';

import {Report} from './Report';

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

  const handleConfirmReport = () => {
    // TODO: call API

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
