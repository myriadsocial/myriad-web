import {useDispatch, useSelector} from 'react-redux';

import {useToasterSnackHook} from './use-toaster-snack.hook';

import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {ReportProps} from 'src/interfaces/report';
import * as InteractionAPI from 'src/lib/api/interaction';
import {RootState} from 'src/reducers';
import {setError} from 'src/reducers/base/actions';
import {UserState} from 'src/reducers/user/reducer';

export const useReport = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const dispatch = useDispatch();

  const {openToasterSnack} = useToasterSnackHook();

  const sendReport = async (reference: Post | Comment, type: string, description: string) => {
    try {
      if (!user) {
        throw new Error('Please login to continue your report');
      }

      const attributes = {
        referenceId: reference.id,
        referenceType: 'platform' in reference ? ReferenceType.POST : ReferenceType.COMMENT,
        type,
        description,
      };

      await InteractionAPI.report(user.id, attributes);

      openToasterSnack({
        message: 'Post report has been submitted',
        variant: 'success',
      });
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    }
  };

  const sendReportWithAttributes = async (value: ReportProps) => {
    try {
      if (!user) {
        throw new Error('Please login to continue your report');
      }

      await InteractionAPI.report(user.id, value);

      openToasterSnack({
        message: 'User has been reported',
        variant: 'success',
      });
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    }
  };

  return {
    sendReport,
    sendReportWithAttributes,
  };
};
