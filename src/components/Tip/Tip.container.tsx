import React from 'react';

import {BoxComponent} from '../atoms/Box';
import {Tip} from './Tip';

export const TipContainer: React.FC = () => {
  return (
    <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
      <Tip />
    </BoxComponent>
  );
};

export default TipContainer;
