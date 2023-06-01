import { UserInterface } from 'interfaces/user';

export interface SubscriptionInterface {
  id?: string;
  user_id: string;
  start_date: Date;
  end_date: Date;
  created_at?: Date;
  updated_at?: Date;

  user?: UserInterface;
  _count?: {};
}
