import {SocialsEnum} from './social';

export interface PeopleProps {
  id: string;
  name: string;
  originUserId: string;
  platform: SocialsEnum;
  profilePictureURL: string;
  username: string;
}

export interface People extends PeopleProps {
  walletAddress?: string;
  //TODO: remove later, experience related attribute
  hide?: boolean;
}
