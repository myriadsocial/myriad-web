import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

type Props = {
  title: string;
  data: string[];
  search: (text: string) => void;
  onSelected: (tag: string) => void;
};
export default function AutoComplete({ title = 'Search..', data = [], search, onSelected }: Props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<string[]>([]);
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

  const handleChange = (e: React.ChangeEvent<{}>, value: string | null) => {
    if (value) {
      onSelected(value);
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
      id="search"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option === value}
      getOptionLabel={option => option}
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
    />
  );
}
