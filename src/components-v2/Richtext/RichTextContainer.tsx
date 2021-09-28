import React from 'react';

import {RichTextComponent} from '.';
import {DefaultRichText} from './RichText.stories';

export const RichTextContainer: React.FC = () => {
  return <RichTextComponent userProfilePict={DefaultRichText.args?.userProfilePict ?? ''} />;
};
