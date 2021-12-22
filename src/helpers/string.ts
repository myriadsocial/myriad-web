import {SyntheticEvent} from 'react';

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
