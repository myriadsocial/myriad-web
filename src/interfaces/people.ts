import { SocialsEnum } from './social';

export interface People {
  id: string;
  platform: SocialsEnum;
  username: string;
  profile_image_url: string;
  platform_account_id: string;
  hide: boolean;
}
