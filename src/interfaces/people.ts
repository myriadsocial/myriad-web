import {ImageSizes} from './base.interface';
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
}
