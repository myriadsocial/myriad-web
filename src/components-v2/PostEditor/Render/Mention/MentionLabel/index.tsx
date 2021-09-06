import {MentionNodeData} from '@udecode/plate';

import React from 'react';

<<<<<<< HEAD
import {ListItemComponent} from '../../../../atoms/ListItem';
=======
import {ListItemComponent} from '../../../../common/ListItem';
>>>>>>> 2181b09b (MYR-717: init editor)

export const renderMentionLabel = (mentionable: MentionNodeData, plain = false) => {
  if (plain) return mentionable.name;

  return <ListItemComponent title={mentionable.name} avatar={mentionable.avatar} />;
};
