import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Autocomplete, { AutocompleteRenderOptionState } from '@material-ui/lab/Autocomplete';

import { usePeople } from '../use-people.hooks';
import { useStyles } from './topic.style';

import { People } from 'src/interfaces/people';

type Props = {
  people: People[];
  onAddItem: (people: People) => void;
  onRemoveItem: (people: People) => void;
};

export default function PeopleComponent({ people, onAddItem, onRemoveItem }: Props) {
  const style = useStyles();

  const { people: options, search } = usePeople();
  const [selectedPeople, setSelectedPeople] = React.useState<People[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(false);
  }, [options]);

  React.useEffect(() => {
    setSelectedPeople(people);
  }, [people]);

  const handleChange = (e: React.ChangeEvent<{}>, people: People | null) => {
    if (people) {
      onAddItem(people);
    }
  };

  const handleSearch = (e: React.ChangeEvent<{}>, value: string | null) => {
    if (value) {
      setLoading(true);

      search(value);
    }
  };

  const toggleVisible = (people: People) => {
    setSelectedPeople([
      ...selectedPeople.map(item => {
        if (item.id === people.id) {
          item.hide = !item.hide;
        }

        return item;
      })
    ]);
  };

  const removeFromExperience = (people: People) => {
    onRemoveItem(people);
  };

  return (
    <Card className={style.root}>
      <CardHeader disableTypography className={style.header} title={<Typography variant="h5">People</Typography>} />
      <CardContent className={style.content}>
        <Autocomplete
          className={style.search}
          id="search"
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          getOptionSelected={(option, value) => option === value}
          getOptionLabel={option => option.username}
          options={options}
          loading={loading}
          onChange={handleChange}
          onInputChange={handleSearch}
          size="small"
          renderInput={params => (
            <TextField
              {...params}
              label={'Search People...'}
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
                  {option.username}
                </Typography>
                <AddCircleOutlineIcon className={style.addButton} />
              </Grid>
            );
          }}
        />

        <List>
          {selectedPeople.map((people, i) => {
            const labelId = `list-label-${people.username}`;

            return (
              <ListItem key={i} dense button>
                <ListItemIcon>
                  <Avatar />
                </ListItemIcon>
                <ListItemText id={labelId} primary={people.username} />
                <ListItemSecondaryAction>
                  {people.hide ? (
                    <IconButton edge="end" aria-label="hide-from-experience" onClick={() => toggleVisible(people)}>
                      <VisibilityOffIcon />
                    </IconButton>
                  ) : (
                    <IconButton edge="end" aria-label="show-on-experience" onClick={() => toggleVisible(people)}>
                      <VisibilityIcon />
                    </IconButton>
                  )}

                  <IconButton edge="end" aria-label="comments" onClick={() => removeFromExperience(people)}>
                    <DeleteForeverIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>

        <Box className={style.more}>
          <Button color="primary" className={style.show}>
            Show All
            <ExpandMoreIcon />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
