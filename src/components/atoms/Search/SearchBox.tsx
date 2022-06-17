import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';

import {SearchBoxProps, SearchBoxColor, useStyles} from '.';
import {SearchIcon} from '../Icons';

import {debounce} from 'lodash';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';

const SearchBox: React.FC<SearchBoxProps> = ({
  color = SearchBoxColor.PRIMARY,
  ariaLabel = 'search-box',
  outlined = false,
  onSubmit,
  iconPosition = 'start',
  hidden = false,
  ...props
}) => {
  const classes = useStyles({outlined, hidden});
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const [input, setInput] = useState('');
  const [textPlaceholder, setTextPlaceholder] = useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const submitClickSearch = () => {
    const debouncedSubmit = debounce(() => {
      if (onSubmit) {
        onSubmit(input);
      }
    }, 500);

    debouncedSubmit();
  };

  const submitSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const debouncedSubmit = debounce(() => {
        if (onSubmit) {
          onSubmit(input);
        }
      }, 500);

      debouncedSubmit();
    }
  };

  useEffect(() => {
    setTextPlaceholder(i18n.t('Home.Search.Placeholder'));
  }, [settings.language]);

  return (
    <Grid
      container
      direction={iconPosition === 'end' ? 'row-reverse' : 'row'}
      className={classes.root}
      component={Paper}
      elevation={iconPosition === 'end' ? 0 : 1}>
      <IconButton className={classes.iconButton} aria-label="search" onClick={submitClickSearch}>
        <SearchIcon />
      </IconButton>
      <InputBase
        onKeyUp={submitSearch}
        className={classes.input}
        value={input}
        onChange={handleChange}
        placeholder={textPlaceholder}
        inputProps={{'aria-label': ariaLabel}}
        {...props}
      />
    </Grid>
  );
};

export default SearchBox;
