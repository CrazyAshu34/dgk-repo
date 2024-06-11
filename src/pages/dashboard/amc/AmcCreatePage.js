import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { ProductAMCAddForm } from 'sections/@dashboard/amc';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { PATH_DASHBOARD } from '../../../routes/paths';


export default function AmcCreatePage() {
  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Helmet>
        <title>Product AMC Management : New Product AMC Management</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Product AMC Management"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Product AMC Management',
              href: PATH_DASHBOARD.amc.list,
            },
            { name: 'New Product AMC Management' },
          ]}
        />
        <ProductAMCAddForm />
      </Container>
    </>
  );
}
