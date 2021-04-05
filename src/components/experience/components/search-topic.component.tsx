import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Autocomplete, { AutocompleteRenderOptionState } from '@material-ui/lab/Autocomplete';

import { Tag } from 'src/interfaces/experience';

//@ts-ignore
type Props = {
  title: string;
  data: Tag[];
  search: (text: string) => void;
  onSelected: (item: Tag) => void;
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

export default function SearchTopic({ title = 'Search..', data = [], search, onSelected }: Props) {
  const style = useStyles();

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Tag[]>([]);
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

  const handleChange = (e: React.ChangeEvent<{}>, topic: Tag | null) => {
    if (topic) {
      onSelected(topic);
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
      getOptionLabel={option => option.id}
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
              {option.id}
            </Typography>
            <AddCircleOutlineIcon className={style.addButton} />
          </Grid>
        );
      }}
    />
  );
}
