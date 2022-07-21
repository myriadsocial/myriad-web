import React from 'react';

import {Typography} from '@material-ui/core';

import {useEditorState} from '../store';

import {formatToString} from 'components/common/NodeViewer/formatter';

type CounterProps = {
  limit: number;
  className: string;
};

export const Counter: React.FC<CounterProps> = props => {
  const {limit, className} = props;

  const editor = useEditorState();

  const length = editor.children.map(element => formatToString(element)).join(' ').length;

  return (
    <Typography variant="body1" component="div" className={className}>
      {length}/{limit}
    </Typography>
  );
};
