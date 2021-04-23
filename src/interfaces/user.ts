interface Credential {
  id?: string;
  token: string;
  people_id: string;
}

export interface User {
  id: string;
  bio?: string;
  name: string;
  profilePictureURL?: string;
  userCredentials: Credential[];
  anonymous: boolean;
}
