import {PlatePlugin} from '@udecode/plate-core';

import {withCharLimit, WordLimitOptions} from './withCharLimit';

export const createCharLimitPlugin = (options: WordLimitOptions): PlatePlugin => ({
  withOverrides: withCharLimit(options),
});
