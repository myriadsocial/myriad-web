import {getPlatePluginTypes, getRenderElement, PlatePlugin} from '@udecode/plate-core';

import {ELEMENT_HASHTAG} from './default';
import {withHashtag} from './withHashtag';

const getHashtagRenderElement = () => {
  console.log('getHashtagRenderElement');
  return getRenderElement(ELEMENT_HASHTAG);
};

export const createHashtagPlugin = (): PlatePlugin => ({
  pluginKeys: ELEMENT_HASHTAG,
  renderElement: getHashtagRenderElement(),
  voidTypes: getPlatePluginTypes(ELEMENT_HASHTAG),
  inlineTypes: getPlatePluginTypes(ELEMENT_HASHTAG),
  withOverrides: withHashtag(),
});
