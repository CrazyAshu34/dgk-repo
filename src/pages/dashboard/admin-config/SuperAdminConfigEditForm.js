import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { PATH_DASHBOARD } from 'routes/paths';
import { AdminConfigEditForm } from 'sections/@dashboard/superadminconfig';

export default function SuperAdminConfigEditForm() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Super Admin Config: Edit Super Admin Config</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Super Admin Config"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Super Admin Config',
              href: PATH_DASHBOARD.superadminconfig.root,
            },
            // { name: currentProduct?.name },
          ]}
        />

        <AdminConfigEditForm
          isEdit
          // currentProduct={currentProduct}
        />
      </Container>
    </>
  );
}
