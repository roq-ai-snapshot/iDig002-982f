import { SoilDataInterface } from 'interfaces/soil-data';
import { ExcavatorInterface } from 'interfaces/excavator';

export interface ProjectInterface {
  id?: string;
  name: string;
  excavator_id: string;
  created_at?: Date;
  updated_at?: Date;
  soil_data?: SoilDataInterface[];
  excavator?: ExcavatorInterface;
  _count?: {
    soil_data?: number;
  };
}
