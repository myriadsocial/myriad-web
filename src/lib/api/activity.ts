import MyriadAPI from './base';

import {ActivityLog, User} from 'src/interfaces/user';

export const skipUsername = async (user: User): Promise<void> => {
  await MyriadAPI().request<ActivityLog>({
    url: `users/${user.id}/skip-username`,
    method: 'POST',
  });
};
