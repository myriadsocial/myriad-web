import React from 'react';

import Typography from '@material-ui/core/Typography';

import {useStyles} from './ReadMore.style';

type Props = {
  text: string;
  maxCharacter: number;
};

export const ReadMore: React.FC<Props> = props => {
  const style = useStyles();
  const {text, maxCharacter} = props;
  const [isMore, setIsMore] = React.useState(false);

  const formatText = isMore ? text : text.slice(0, maxCharacter);

  const handleChange = () => {
    setIsMore(true);
  };

  return (
    <>
      {formatText}
      {!isMore && text.length > maxCharacter && (
        <Typography
          className={style.pointer}
          onClick={handleChange}
          component="span"
          color="textSecondary">
          .. more
        </Typography>
      )}
    </>
  );
};
