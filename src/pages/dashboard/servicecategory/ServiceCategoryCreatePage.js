import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { useSettingsContext } from 'components/settings';
import { PATH_DASHBOARD } from 'routes/paths';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { ServiceCategoryAddForm } from '../../../sections/@dashboard/servicecategory';

export default function ServiceCategoryCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Service Category: New Service Category</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Service Category"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Service Category',
              href: PATH_DASHBOARD.servicecategory.list,
            },
            { name: 'New Service Category' },
          ]}
        />
        <ServiceCategoryAddForm />
      </Container>
    </>
  );
}
