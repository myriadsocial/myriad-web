import React from 'react';

import {FriendListComponent} from '../../FriendsMenu/FriendList';
import {DropdownMenu} from '../../atoms/DropdownMenu';
import {menuOptions, friends} from './default';
import {useStyles} from './friendTabPanel.style';

export const FriendTabPanelComponent: React.FC = () => {
  const style = useStyles();

  const handleSortChange = (sort: string) => {
    // code
  };

  const loadNextPage = () => {
    // code
  };

  return (
    <>
      <div className={style.mb20}>
        <DropdownMenu title="Sort by" options={menuOptions} onChange={handleSortChange} />
      </div>
      <FriendListComponent
        friends={friends}
        onSearch={console.log}
        onFilter={console.log}
        hasMore={false}
        onLoadNextPage={loadNextPage}
      />
    </>
  );
};
