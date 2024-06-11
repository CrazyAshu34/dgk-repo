import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { PATH_DASHBOARD } from 'routes/paths';
import { StaffAddForm } from 'sections/@dashboard/staff';

export default function StaffCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Create a new Staff</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new staff"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Staff',
              href: PATH_DASHBOARD.staff.list,
            },
            {
              name: 'New staff',
            },
          ]}
        />
        <StaffAddForm />
      </Container>
    </>
  );
}
