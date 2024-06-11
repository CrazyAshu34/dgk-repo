import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { useGetOneServiceById } from 'services/serviceServices';
import { ServiceAddForm } from '../../../sections/@dashboard/service';
import BlankPage from '../BlankPage';
 
export default function Edit() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const { data: serviceData, isLoading, isError } = useGetOneServiceById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  console.log('serviceData', serviceData);

  return (
    <>
      <Helmet>
        <title>Service Management : Edit Service Management</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Service Management"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Service Management',
              href: PATH_DASHBOARD.service.list,
            },
            { name: serviceData?.service_id },
          ]}
        />
        <ServiceAddForm isEdit serviceData={serviceData} />
      </Container>
    </>
  );
}
