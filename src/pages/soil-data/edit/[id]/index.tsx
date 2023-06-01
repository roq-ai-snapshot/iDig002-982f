import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getSoilDataById, updateSoilDataById } from 'apiSdk/soil-data';
import { Error } from 'components/error';
import { soilDataValidationSchema } from 'validationSchema/soil-data';
import { SoilDataInterface } from 'interfaces/soil-data';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ProjectInterface } from 'interfaces/project';
import { UserInterface } from 'interfaces/user';
import { getProjects } from 'apiSdk/projects';
import { getUsers } from 'apiSdk/users';

function SoilDataEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SoilDataInterface>(
    () => (id ? `/soil-data/${id}` : null),
    () => getSoilDataById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SoilDataInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSoilDataById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SoilDataInterface>({
    initialValues: data,
    validationSchema: soilDataValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Soil Data
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="latitude" mb="4" isInvalid={!!formik.errors?.latitude}>
              <FormLabel>latitude</FormLabel>
              <NumberInput
                name="latitude"
                value={formik.values?.latitude}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('latitude', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors?.latitude && <FormErrorMessage>{formik.errors?.latitude}</FormErrorMessage>}
            </FormControl>
            <FormControl id="longitude" mb="4" isInvalid={!!formik.errors?.longitude}>
              <FormLabel>longitude</FormLabel>
              <NumberInput
                name="longitude"
                value={formik.values?.longitude}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('longitude', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors?.longitude && <FormErrorMessage>{formik.errors?.longitude}</FormErrorMessage>}
            </FormControl>
            <FormControl id="soil_type" mb="4" isInvalid={!!formik.errors?.soil_type}>
              <FormLabel>soil_type</FormLabel>
              <Input type="text" name="soil_type" value={formik.values?.soil_type} onChange={formik.handleChange} />
              {formik.errors.soil_type && <FormErrorMessage>{formik.errors?.soil_type}</FormErrorMessage>}
            </FormControl>
            <FormControl id="soil_depth" mb="4" isInvalid={!!formik.errors?.soil_depth}>
              <FormLabel>soil_depth</FormLabel>
              <NumberInput
                name="soil_depth"
                value={formik.values?.soil_depth}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('soil_depth', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.soil_depth && <FormErrorMessage>{formik.errors?.soil_depth}</FormErrorMessage>}
            </FormControl>
            <FormControl id="created_at" mb="4">
              <FormLabel>created_at</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.created_at}
                onChange={(value: Date) => formik.setFieldValue('created_at', value)}
              />
            </FormControl>
            <FormControl id="updated_at" mb="4">
              <FormLabel>updated_at</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.updated_at}
                onChange={(value: Date) => formik.setFieldValue('updated_at', value)}
              />
            </FormControl>
            <AsyncSelect<ProjectInterface>
              formik={formik}
              name={'project_id'}
              label={'project_id'}
              placeholder={'Select Project'}
              fetcher={getProjects}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.id}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'contributor_id'}
              label={'contributor_id'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.id}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'soil_data',
  operation: AccessOperationEnum.UPDATE,
})(SoilDataEditPage);
