import {useSelector} from 'react-redux';

import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {ReportProps, ReportType} from 'src/interfaces/report';
import * as InteractionAPI from 'src/lib/api/interaction';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const useReport = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const sendReport = async (reference: Post | Comment, type: ReportType, reason: string) => {
    if (user) {
      const attributes: ReportProps = {
        referenceId: reference.id,
        referenceType: 'platform' in reference ? ReferenceType.POST : ReferenceType.COMMENT,
        type,
        reason,
        userId: user.id,
        reportedBy: user?.name,
        postId: 'platform' in reference ? reference.id : reference.postId,
      };

      await InteractionAPI.report(attributes);
    }
  };

  return {
    sendReport,
  };
};
