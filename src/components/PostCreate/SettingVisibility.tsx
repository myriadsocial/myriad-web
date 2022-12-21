import {PlusCircleIcon, SearchIcon, XCircleIcon} from '@heroicons/react/solid';

import React, {useState} from 'react';

import {IconButton, SvgIcon, TextField, Typography} from '@material-ui/core';
import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteRenderOptionState,
} from '@material-ui/lab';

import {ListItemPeopleComponent} from '../atoms/ListItem/ListItemPeople';
import {useStyles} from './SettingVisibility.styles';

import {debounce, isEmpty} from 'lodash';
import {useSearchHook} from 'src/hooks/use-search.hooks';
import {People} from 'src/interfaces/people';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';

interface SettingVisibilityInterface {
  setPost: (value) => void;
}
export default function SettingVisibility(props: SettingVisibilityInterface) {
  const {setPost} = props;
  const styles = useStyles();
  const [userSelected, setUserSelected] = useState([]);
  const {searchUsers, users, clearUsers} = useSearchHook();
  const handlePeopleChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    value: User[],
    reason: AutocompleteChangeReason,
  ) => {
    if (reason === 'select-option') {
      setUserSelected(value);
      setPost(prevPost => ({
        ...prevPost,
        selectedUserIds: value.map(item => {
          return item.id;
        }),
      }));
      clearSearchedUser();
    }
  };

  const clearSearchedUser = () => {
    const debounceSubmit = debounce(() => {
      clearUsers();
    }, 300);

    debounceSubmit();
  };

  const handleSearchUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    const debounceSubmit = debounce(() => {
      searchUsers(event.target.value);
    }, 300);

    debounceSubmit();
  };

  const removeSelectedUser = (selected: People) => () => {
    setUserSelected(userSelected.filter(people => people.id != selected.id));
  };

  return (
    <div>
      <Autocomplete
        id="experience-people"
        onBlur={clearSearchedUser}
        className={styles.people}
        value={userSelected}
        multiple
        options={users}
        getOptionSelected={(option, value) => option.id === value.id}
        filterSelectedOptions={true}
        getOptionLabel={option => `${option.username} ${option.name}`}
        disableClearable
        autoHighlight={false}
        popupIcon={
          <SvgIcon classes={{root: styles.fill}} component={SearchIcon} viewBox={'0 0 20 20'} />
        }
        classes={{popupIndicator: styles.popupIndicator}}
        style={{transform: 'none'}}
        onChange={handlePeopleChange}
        renderTags={() => null}
        renderInput={params => (
          <TextField
            {...params}
            error={false}
            label={i18n.t('Experience.Editor.Label_3')}
            placeholder={i18n.t('Experience.Editor.Placeholder_3')}
            variant="outlined"
            onChange={handleSearchUser}
            InputProps={{
              ...params.InputProps,
              endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
            }}
            helperText={''}
          />
        )}
        renderOption={(option, state: AutocompleteRenderOptionState) => {
          if (option.id === '') return null;
          return (
            <div className={styles.option}>
              <ListItemPeopleComponent
                id="selectable-experience-list-item"
                title={option.name}
                subtitle={<Typography variant="caption">@{option.username}</Typography>}
                avatar={option.profilePictureURL}
                platform={option.platform}
                action={
                  <IconButton className={styles.removePeople}>
                    {state.selected ? (
                      <SvgIcon
                        classes={{root: styles.fill}}
                        component={XCircleIcon}
                        color="error"
                        viewBox={'0 0 20 20'}
                      />
                    ) : (
                      <SvgIcon
                        classes={{root: styles.fill}}
                        component={PlusCircleIcon}
                        viewBox={'0 0 20 20'}
                      />
                    )}
                  </IconButton>
                }
              />
            </div>
          );
        }}
      />
      <div className={styles.preview}>
        {userSelected
          .filter(users => !isEmpty(users.id))
          .map(user => (
            <ListItemPeopleComponent
              id="selected-experience-list-item"
              key={user.id}
              title={user.name}
              subtitle={<Typography variant="caption">@{user.username}</Typography>}
              avatar={user.profilePictureURL}
              platform={user.platform}
              action={
                <IconButton onClick={removeSelectedUser(user)}>
                  <SvgIcon
                    classes={{root: styles.fill}}
                    component={XCircleIcon}
                    color="error"
                    viewBox={'0 0 20 20'}
                  />
                </IconButton>
              }
            />
          ))}
      </div>
    </div>
  );
}
