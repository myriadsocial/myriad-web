import { Server } from 'src/lib/api/server';

export interface ServerListProps {
  id: number;
  owner: string;
  apiUrl: string;
  detail?: Server;
}
