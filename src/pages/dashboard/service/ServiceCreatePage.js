import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { PATH_DASHBOARD } from 'routes/paths';
import { ServiceAddForm } from '../../../sections/@dashboard/service';

export default function ServiceCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Create a new Service Management</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new Service Management"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Service Management',
              href: PATH_DASHBOARD.service.list,
            },
            {
              name: 'New Service Management',
            },
          ]}
        />
        <ServiceAddForm />
      </Container>
    </>
  );
}
