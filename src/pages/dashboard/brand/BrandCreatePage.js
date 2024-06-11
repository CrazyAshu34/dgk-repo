import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { BrandAddForm } from '../../../sections/@dashboard/brand';

export default function CategoryCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Brand: New Brand</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Brand"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Brand',
              href: PATH_DASHBOARD.brand.list,
            },
            { name: 'New Brand' },
          ]}
        />
        <BrandAddForm />
      </Container>
    </>
  );
}
