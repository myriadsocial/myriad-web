import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Autocomplete, { AutocompleteRenderOptionState } from '@material-ui/lab/Autocomplete';

import useDebounce from '../../helpers/use-debounce.hooks';

import { User } from 'src/interfaces/user';

//@ts-ignore
type Props = {
  title: string;
  data: User[];
  search: (text: string) => void;
  onSelected: (item: User) => void;
};

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1)
    },
    optionItem: {
      position: 'relative',
      flex: 1
    },
    addButton: {
      position: 'absolute',
      top: 0,
      right: 0
    }
  })
);

export default function SearchUser({ title = 'Search..', data = [], search, onSelected }: Props) {
  const style = useStyles();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);

  const debouncedValue = useDebounce(searchQuery, 500) ?? '';

  React.useEffect(() => {
    search(debouncedValue);
  }, [debouncedValue]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  React.useEffect(() => {
    setOptions(data);
    setLoading(false);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<{}>, user: User | null) => {
    if (user) {
      onSelected(user);
    }
  };

  const handleSearch = (e: React.ChangeEvent<{}>, value: string | null) => {
    if (value) {
      setLoading(true);
      setSearchQuery(value);
    }
  };

  return (
    <Autocomplete
      className={style.root}
      id="search-user"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option === value}
      getOptionLabel={option => option.name}
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
            )
          }}
        />
      )}
      renderOption={(option, state: AutocompleteRenderOptionState) => {
        return (
          <Grid className={style.optionItem}>
            <Typography variant="body1" color="textSecondary">
              {option.name}
            </Typography>
          </Grid>
        );
      }}
    />
  );
}
