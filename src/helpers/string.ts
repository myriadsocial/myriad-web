import { SyntheticEvent } from 'react';

import { BN, BN_TEN } from '@polkadot/util';

import parse from 'html-react-parser';

export const acronym = (value: string): string => {
  if (!value) return '';
  return value
    .split(/\s/)
    .reduce((response, word) => (response += word.slice(0, 1)), '')
    .substring(0, 2)
    .toUpperCase();
};

export const capitalize = (text: string): string => {
  const word = text.toLowerCase();

  return word[0].toUpperCase() + word.substring(1);
};

export const parseHashtag = (
  value: string,
  hashtagRenderer: any,
  urlRenderer: any,
  action: (e: SyntheticEvent, hashtag: string) => void,
): string[] => {
  const hashtagRule = /([#|＃][^\s]+)/g;
  const urlRule =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;

  return value.split(hashtagRule).map((chunk: string) => {
    if (chunk.match(hashtagRule)) {
      return hashtagRenderer(chunk, action);
    }

    return chunk.split(urlRule).map(text => {
      if (text.match(urlRule)) {
        return urlRenderer(text);
      }

      return parse(text);
    });
  });
};

export const validateImageUrl = (url: string) => {
  return url.match(/^http[^\?]*.(jpg|jpeg|png)(\?(.*))?$/gim) != null;
};

export const isHashtag = (value: string): boolean => {
  const hashtagRule = /([#|＃][^\s]+)/g;

  return hashtagRule.test(value);
};

export const toBigNumber = (value: string, decimal: number): BN => {
  let result: BN;

  const isDecimalValue = value.match(/^(\d+)\.(\d+)$/);

  if (isDecimalValue) {
    const div = new BN(value.replace(/\.\d*$/, ''));
    const modString = value.replace(/^\d+\./, '').substr(0, decimal);
    const mod = new BN(modString);

    result = div
      .mul(BN_TEN.pow(new BN(decimal)))
      .add(mod.mul(BN_TEN.pow(new BN(decimal - modString.length))));
  } else {
    result = new BN(value).mul(BN_TEN.pow(new BN(decimal)));
  }

  return result;
};

export const isJson = (value: string) => {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }

  return true;
};

export const htmlToJson = (html: any) => {
  const img: string[] = [];
  let text = '';

  if (Array.isArray(html)) {
    html.map(item => {
      if (item.type === 'figure') {
        if (item.props.children.type === 'img') {
          const imgs = item.props.children.props.src;
          img.push(imgs);
        }
      } else {
        if (Array.isArray(item.props.children)) {
          item.props.children.map(child => {
            if (child.type === 'img') {
              const imgs = child.props.src;
              img.push(imgs);
            } else {
              if (typeof child === 'string') text += child;
              else text += child.props.children;
            }
          });
        } else {
          if (item.type === 'img') {
            const imgs = item.props.children.src;
            img.push(imgs);
          } else {
            if (typeof item.props.children === 'string')
              text += item.props.children;
            else text += item.props.children.props.children;
          }
        }
      }
    });
  } else {
    if (html.type === 'figure') {
      if (html.props.children.type === 'img') {
        const imgs = html.props.children.props.src;
        img.push(imgs);
      }
    } else {
      if (Array.isArray(html.props.children)) {
        html.props.children.map(child => {
          if (child.type === 'img') {
            const imgs = child.props.src;
            img.push(imgs);
          } else {
            if (typeof child === 'string') text += child;
            else text += child.props.children;
          }
        });
      } else {
        if (html.type === 'img') {
          const imgs = html.props.children.src;
          img.push(imgs);
        } else {
          if (typeof html.props.children === 'string')
            text += html.props.children;
          else text += html.props.children.props.children;
        }
      }
    }
  }

  return { img, text };
};
