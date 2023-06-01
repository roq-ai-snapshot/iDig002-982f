import { ProjectInterface } from 'interfaces/project';
import { UserInterface } from 'interfaces/user';

export interface SoilDataInterface {
  id?: string;
  project_id: string;
  contributor_id: string;
  latitude: number;
  longitude: number;
  soil_type: string;
  soil_depth: number;
  created_at?: Date;
  updated_at?: Date;

  project?: ProjectInterface;
  user?: UserInterface;
  _count?: {};
}
