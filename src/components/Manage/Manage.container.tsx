import React from 'react';

import {BoxComponent} from '../atoms/Box';
import {Manage} from './Manage';

export const ManageCointainer: React.FC = () => {
  return (
    <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
      <Manage />
    </BoxComponent>
  );
};

export default ManageCointainer;
