import * as yup from 'yup';

export const soilDataValidationSchema = yup.object().shape({
  latitude: yup.number().required(),
  longitude: yup.number().required(),
  soil_type: yup.string().required(),
  soil_depth: yup.number().integer().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  project_id: yup.string().nullable().required(),
  contributor_id: yup.string().nullable().required(),
});
