import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { PATH_DASHBOARD } from 'routes/paths';
import { SuperSubCategoryAddForm } from 'sections/@dashboard/supersubcategory';

export default function SuperSubCategoryCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Super Sub Category: New Super Sub Category</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Super Sub Category"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Super Sub Category',
              href: PATH_DASHBOARD.supersubcategory.list,
            },
            { name: 'New Super Sub Category' },
          ]}
        />
        <SuperSubCategoryAddForm />
      </Container>
    </>
  );
}
