import React from 'react';

import { useRouter } from 'next/router';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete, { AutocompleteRenderOptionState } from '@material-ui/lab/Autocomplete';

import useDebounce from '../../helpers/use-debounce.hooks';

import { User } from 'src/interfaces/user';

//@ts-ignore
type SearchUserProps = {
  title: string;
  data: User[];
  search: (text: string) => void;
  onSelected: (item: User) => void;
};

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      maxWidth: '100%'
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

const SearchUser: React.FC<SearchUserProps> = ({ title = 'Search..', data, search }) => {
  const style = useStyles();

  //const router = useRouter();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);

  const debouncedValue = useDebounce(searchQuery, 2000) ?? '';

  React.useEffect(() => {
    search(debouncedValue);
  }, [debouncedValue]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  //const handleSearch = (value: string | null) => {
  //if (value) {
  //setLoading(true);
  //setSearchQuery(value);
  //}
  //};

  React.useEffect(() => {
    setOptions(data);
    setLoading(false);
  }, [data]);

  //const handleChange = (e: React.ChangeEvent<{}>, user: User | null) => {
  //if (user) {
  //onSelected(user);
  //}
  //};

  const handleSearch = (e: React.ChangeEvent<{}>, value: string | null) => {
    if (value) {
      setLoading(true);
      setSearchQuery(value);
    }
  };

  const redirectToProfilePage = (url: string) => {
    router.push(`/${url}`);
  };

  return (
    <Autocomplete
      className={style.root}
      freeSolo
      id="search-user"
      aria-label="search-posts-people-or-topics"
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
      //onChange={handleChange}
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
                {loading ? <CircularProgress color="inherit" size={20} /> : <SearchIcon />}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
      renderOption={(option, state: AutocompleteRenderOptionState) => {
        return (
          <Grid container direction="column" alignItems="center">
            <Button onClick={() => redirectToProfilePage(option.id)}>
              <Grid item>
                <IconButton aria-label="avatar-icon">
                  <Avatar aria-label="avatar" src={option.profilePictureURL} />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="body1" color="textSecondary">
                  {option.name}
                </Typography>
              </Grid>
            </Button>
          </Grid>
        );
      }}
    />
  );
};

export default SearchUser;
