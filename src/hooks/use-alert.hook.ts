import { useAlert, AlertActionType } from 'src/context/Alert.context';
import { ErrorProp } from 'src/interfaces/error';

export const useAlertHook = () => {
  const { state, dispatch } = useAlert();

  const showAlert = (error: ErrorProp) => {
    dispatch({
      type: AlertActionType.SET_ALERT,
      payload: error
    });
  };

  const showTipAlert = (error: ErrorProp) => {
    dispatch({
      type: AlertActionType.SET_TIP_ALERT,
      payload: error
    });
  };

  const clearAlert = () => {
    dispatch({
      type: AlertActionType.CLEAR_ALERT
    });
  };

  return {
    error: state,
    isTipping: state.isTipping,
    showAlert,
    showTipAlert,
    clearAlert
  };
};
