import {LinkPlugin} from '@udecode/plate';
import {createPluginFactory, isUrl as isUrlProtocol} from '@udecode/plate-core';

import {withLink} from './withLink';

export const ELEMENT_LINK = 'a';

/**
 * Enables support for hyperlinks.
 */
export const createLinkPlugin = createPluginFactory<LinkPlugin>({
  key: ELEMENT_LINK,
  isElement: true,
  isInline: true,
  props: ({element}) => ({nodeProps: {url: element?.url}}),
  withOverrides: withLink,
  options: {
    isUrl: isUrlProtocol,
    rangeBeforeOptions: {
      matchString: ' ',
      skipInvalid: true,
      afterMatch: true,
    },
  },
  then: (editor, {type}) => ({
    deserializeHtml: {
      rules: [
        {
          validNodeName: 'A',
        },
      ],
      getNode: el => ({
        type,
        url: el.getAttribute('href'),
      }),
    },
  }),
});
