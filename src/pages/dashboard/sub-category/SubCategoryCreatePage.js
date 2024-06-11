import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { PATH_DASHBOARD } from 'routes/paths';
import { SubCategoryAddForm } from 'sections/@dashboard/subcategory';

export default function SubCategoryCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Sub Category: New Sub Category</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Sub Category"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Sub Category',
              href: PATH_DASHBOARD.subcategory.list,
            },
            { name: 'New Sub Category' },
          ]}
        />
        <SubCategoryAddForm />
      </Container>
    </>
  );
}
