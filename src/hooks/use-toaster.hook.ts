import {useSelector, useDispatch} from 'react-redux';

import {ToasterProps} from '../interfaces/toaster';
import {RootState} from '../reducers/';
import {showToaster, closeToaster} from '../reducers/toaster/actions';
import {ToasterState} from '../reducers/toaster/reducer';

export const useToasterHook = () => {
  const {open, toasterStatus, message} = useSelector<RootState, ToasterState>(
    state => state.toasterState,
  );
  const dispatch = useDispatch();

  const openToaster = (payload: ToasterProps) => {
    showToaster(payload);
  };

  const clearToaster = () => {
    closeToaster();
    dispatch(closeToaster());
  };

  return {
    open,
    toasterStatus,
    message,
    openToaster,
    clearToaster,
  };
};
