import {Snackbar} from './Snackbar';
import {SnackbarProps} from './Snackbar.interface';

import {useSnackbar as useDefaultSnackbar} from 'notistack';

export const useEnqueueSnackbar = () => {
  const {enqueueSnackbar} = useDefaultSnackbar();

  const pushSnackbar = (payload: Omit<SnackbarProps, 'key'> & {id?: string | number}) => {
    const {message, variant, id} = payload;

    enqueueSnackbar(payload.message, {
      variant,
      preventDuplicate: true,
      content: key => {
        return <Snackbar key={id ?? key} message={message} variant={variant} />;
      },
    });
  };

  return pushSnackbar;
};
