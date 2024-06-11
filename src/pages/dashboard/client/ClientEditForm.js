import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { ClientAddForm } from 'sections/@dashboard/client';
import { useGetOneClientById } from 'services/clientServices';
import BlankPage from '../BlankPage';

export default function ClientEditForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: clientData, isLoading, isError } = useGetOneClientById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Client: Edit Client</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a Edit Client"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Client',
              href: PATH_DASHBOARD.client.list,
            },
            { name: clientData?.name },
          ]}
        />
        <ClientAddForm isEdit clientData={clientData} />
      </Container>
    </>
  );
}
