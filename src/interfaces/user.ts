interface Credential {
  id?: string;
  token: string;
  people_id: string;
}

export interface User {
  id: string;
  name: string;
  profilePictureURL?: string;
  userCredentials: Credential[];
}
