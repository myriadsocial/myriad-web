import {useSelector, useDispatch} from 'react-redux';

import {ToasterSnackProps} from '../interfaces/toaster-snack';
import {RootState} from '../reducers/';
import {
  showToasterSnack,
  closeToasterSnack,
  storeDisplayedToastSnack,
  clearDisplayedToastSnack,
} from '../reducers/toaster-snack/actions';
import {ToasterNotificationState} from '../reducers/toaster-snack/reducer';

import {VariantType} from 'notistack';

interface OpenToasterInterface {
  message: string;
  variant: VariantType;
  key?: string | number;
}

export const useToasterSnackHook = () => {
  const {notifications, displayed} = useSelector<RootState, ToasterNotificationState>(
    state => state.toasterSnackState,
  );
  const dispatch = useDispatch();

  const openToasterSnack = (payload: OpenToasterInterface) => {
    const _payload: ToasterSnackProps = {
      message: payload.message,
      variant: payload.variant,
      key: payload.key || new Date().getTime() + Math.random(),
    };
    dispatch(showToasterSnack(_payload));
  };

  const clearToasterSnack = (payload: {key: string | number}) => {
    dispatch(closeToasterSnack(payload));
  };

  const saveDisplayedToastSnack = (key: string | number) => {
    dispatch(storeDisplayedToastSnack(key));
  };

  const removeDisplayedToastSnack = (key: string | number) => {
    dispatch(clearDisplayedToastSnack(key));
  };

  return {
    notifications,
    displayed,
    openToasterSnack,
    clearToasterSnack,
    saveDisplayedToastSnack,
    removeDisplayedToastSnack,
  };
};
