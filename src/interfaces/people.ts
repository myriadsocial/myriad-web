import {ImageSizes} from './assets';
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
  profilePicture: ImageSizes;
  //TODO: remove later, experience related attribute
  hide?: boolean;
}
