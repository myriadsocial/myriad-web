import {HeadingToolbar, ToolbarProps, withPlateEventProvider} from '@udecode/plate';

import React from 'react';

export const Toolbar = withPlateEventProvider((props: ToolbarProps) => (
  <HeadingToolbar {...props} />
));
