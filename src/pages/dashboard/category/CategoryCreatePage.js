import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { useSettingsContext } from 'components/settings';
import { PATH_DASHBOARD } from 'routes/paths';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { CategoryAddForm } from 'sections/@dashboard/category';

export default function CategoryCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Category: New Category</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Category"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Category',
              href: PATH_DASHBOARD.category.list,
            },
            { name: 'New Category' },
          ]}
        />
        <CategoryAddForm />
      </Container>
    </>
  );
}
