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
import i18n from 'src/locale';

export const useReport = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const dispatch = useDispatch();

  const {openToasterSnack} = useToasterSnackHook();

  const sendReport = async (reference: Post | Comment, type: string, description: string) => {
    try {
      if (!user) {
        throw new Error(i18n.t('Post_Comment.Modal_Report.Error_Login'));
      }

      const attributes = {
        referenceId: reference.id,
        referenceType: 'platform' in reference ? ReferenceType.POST : ReferenceType.COMMENT,
        type,
        description,
      };

      await InteractionAPI.report(user.id, attributes);

      openToasterSnack({
        message: i18n.t('Post_Comment.Modal_Report.Toaster_Success'),
        variant: 'success',
      });
    } catch (error) {
      dispatch(setError(error));
    }
  };

  const sendReportWithAttributes = async (value: ReportProps) => {
    try {
      if (!user) {
        throw new Error(i18n.t('Profile.Modal_Report.Error_Login'));
      }

      await InteractionAPI.report(user.id, value);

      openToasterSnack({
        message: i18n.t('Profile.Modal_Report.Toaster_Success'),
        variant: 'success',
      });
    } catch (error) {
      dispatch(setError(error));
    }
  };

  return {
    sendReport,
    sendReportWithAttributes,
  };
};
