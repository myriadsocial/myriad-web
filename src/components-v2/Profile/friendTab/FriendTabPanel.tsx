import React from 'react';

import {FriendListComponent} from '../../FriendsMenu/friend-list';
import {DropdownMenu} from '../../atoms/DropdownMenu';
import {menuOptions, friends} from './default';
import {useStyles} from './friendTabPanel.style';

export const FriendTabPanelComponent: React.FC = () => {
  const style = useStyles();

  const handleSortChange = (sort: string) => {
    // code
  };

  return (
    <>
      <div className={style.mb20}>
        <DropdownMenu title="Sort by" options={menuOptions} onChange={handleSortChange} />
      </div>
      <FriendListComponent friends={friends} />
    </>
  );
};
