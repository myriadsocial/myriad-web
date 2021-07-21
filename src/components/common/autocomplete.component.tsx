import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Autocomplete, {AutocompleteRenderOptionState} from '@material-ui/lab/Autocomplete';

type SearchType = 'text' | 'card';

//@ts-ignore
type Props = {
  title: string;
  data: any[];
  search: (text: string) => void;
  onSelected: (item: any) => void;
  type: SearchType;
};

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
    },
    optionItem: {
      position: 'relative',
      flex: 1,
    },
    addButton: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
  }),
);

export default function AutoComplete({
  title = 'Search..',
  data = [],
  search,
  onSelected,
  type = 'text',
}: Props) {
  const style = useStyles();

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  React.useEffect(() => {
    setOptions(data);
    setLoading(false);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<{}>, value: any | null) => {
    if (value) {
      onSelected(value.name);
    }
  };

  const handleSearch = (e: React.ChangeEvent<{}>, value: string | null) => {
    if (value) {
      setLoading(true);

      search(value);
    }
  };

  return (
    <Autocomplete
      className={style.root}
      id="search"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option === value}
      getOptionLabel={option => option.username || option}
      options={options}
      loading={loading}
      onChange={handleChange}
      onInputChange={handleSearch}
      size="small"
      renderInput={params => (
        <TextField
          {...params}
          label={title}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(option, state: AutocompleteRenderOptionState) => {
        return type === 'text' ? (
          <Typography>{option}</Typography>
        ) : (
          <Grid className={style.optionItem}>
            <Typography variant="body1" color="textSecondary">
              {option.username}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              by: {option.user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {option.description}
            </Typography>
            <AddCircleOutlineIcon className={style.addButton} />
          </Grid>
        );
      }}
    />
  );
}
