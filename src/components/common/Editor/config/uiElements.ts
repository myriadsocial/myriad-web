import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_LINK,
  LinkElement,
  StyledElement,
  withProps,
} from '@udecode/plate';

export const baseUIElements = {
  [ELEMENT_H1]: withProps(StyledElement, {
    styles: {
      root: {
        fontSize: 34,
        fontWeight: '500',
      },
    },
  }),
  [ELEMENT_H2]: withProps(StyledElement, {
    styles: {
      root: {
        fontSize: 28,
        fontWeight: '500',
      },
    },
  }),
  [ELEMENT_H3]: withProps(StyledElement, {
    styles: {
      root: {
        fontSize: 22,
        fontWeight: '500',
      },
    },
  }),
  [ELEMENT_H4]: withProps(StyledElement, {
    styles: {
      root: {
        fontSize: 18,
        fontWeight: '500',
      },
    },
  }),
  [ELEMENT_H5]: withProps(StyledElement, {
    styles: {
      root: {
        fontSize: 16,
        fontWeight: '500',
      },
    },
  }),
  [ELEMENT_LINK]: withProps(LinkElement, {
    styles: {
      root: {
        color: '#7342CC!important',
      },
    },
  }),
};
