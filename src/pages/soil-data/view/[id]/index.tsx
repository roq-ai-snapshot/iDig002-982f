import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getSoilDataById } from 'apiSdk/soil-data';
import { Error } from 'components/error';
import { SoilDataInterface } from 'interfaces/soil-data';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function SoilDataViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SoilDataInterface>(
    () => (id ? `/soil-data/${id}` : null),
    () =>
      getSoilDataById(id, {
        relations: ['project', 'user'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Soil Data Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              latitude: {data?.latitude}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              longitude: {data?.longitude}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              soil_type: {data?.soil_type}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              soil_depth: {data?.soil_depth}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              created_at: {data?.created_at as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              updated_at: {data?.updated_at as unknown as string}
            </Text>
            {hasAccess('project', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                project: <Link href={`/projects/view/${data?.project?.id}`}>{data?.project?.id}</Link>
              </Text>
            )}
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                user: <Link href={`/users/view/${data?.user?.id}`}>{data?.user?.id}</Link>
              </Text>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'soil_data',
  operation: AccessOperationEnum.READ,
})(SoilDataViewPage);
