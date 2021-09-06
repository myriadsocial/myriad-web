import {MentionNodeData} from '@udecode/plate';

import React from 'react';

import {ListItemComponent} from '../../../../atoms/ListItem';

export const renderMentionLabel = (mentionable: MentionNodeData, plain = false) => {
  if (plain) return mentionable.name;

  return <ListItemComponent title={mentionable.name} avatar={mentionable.avatar} />;
};
