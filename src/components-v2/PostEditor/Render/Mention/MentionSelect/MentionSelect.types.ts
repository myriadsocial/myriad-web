import {GetMentionSelectProps, MentionNodeData} from '@udecode/plate-mention';
import {StyledProps} from '@udecode/plate-styled-components';

import React from 'react';

import {CSSProp} from 'styled-components';

export interface MentionSelectStyles {
  mentionItem: CSSProp;
  mentionItemSelected: CSSProp;
}

export interface MentionSelectProps
  extends GetMentionSelectProps,
    StyledProps<MentionSelectStyles> {
  renderLabel?: (mentionable: MentionNodeData, plain?: boolean) => string | React.ReactNode;
  portalElement?: Element;
}
