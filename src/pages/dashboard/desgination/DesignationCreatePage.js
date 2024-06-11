import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { DesignationAddForm } from '../../../sections/@dashboard/designation';

export default function CategoryCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Designation: New Designation</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Designation"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Designation',
              href: PATH_DASHBOARD.designation.list,
            },
            { name: 'New Designation' },
          ]}
        />
        <DesignationAddForm />
      </Container>
    </>
  );
}
