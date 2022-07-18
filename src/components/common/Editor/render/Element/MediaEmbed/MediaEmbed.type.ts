import {TMediaEmbedElement} from '@udecode/plate';
import {Value} from '@udecode/plate-core';
import {StyledElementProps} from '@udecode/plate-styled-components';

import {CSSProp} from 'styled-components';

export interface MediaEmbedElementStyles {
  iframeInputWrapper: CSSProp;
  iframeWrapper: CSSProp;
  iframe: CSSProp;
  input: CSSProp;
}

export type MediaEmbedElementProps<V extends Value> = StyledElementProps<
  V,
  TMediaEmbedElement,
  MediaEmbedElementStyles
>;
