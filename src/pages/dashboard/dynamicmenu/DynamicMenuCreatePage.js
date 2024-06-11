import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { PATH_DASHBOARD } from 'routes/paths';
import { DynamicMenuAddForm } from 'sections/@dashboard/dynamicmenu';

export default function DynamicMenuCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Dynamic Menu: New Dynamic Menu</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Dynamic Menu"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Dynamic Menu',
              href: PATH_DASHBOARD.dynamicmenu.list,
            },
            { name: 'New Dynamic Menu' },
          ]}
        />
        <DynamicMenuAddForm />
      </Container>
    </>
  );
}
