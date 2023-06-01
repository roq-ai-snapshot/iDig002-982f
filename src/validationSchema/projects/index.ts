import * as yup from 'yup';
import { soilDataValidationSchema } from 'validationSchema/soil-data';

export const projectValidationSchema = yup.object().shape({
  name: yup.string().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  excavator_id: yup.string().nullable().required(),
  soil_data: yup.array().of(soilDataValidationSchema),
});
