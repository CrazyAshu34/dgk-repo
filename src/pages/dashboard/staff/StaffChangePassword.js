import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { ChangePassword } from 'sections/@dashboard/staff';
import { useGetOneStaffById } from 'services/staffServices';
import BlankPage from '../BlankPage';

export default function StaffChangePassword() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const { data: onestaffData, isLoading, isError } = useGetOneStaffById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError === true) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Staff || ChangePassword</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Staff Change Password"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Staff',
              href: PATH_DASHBOARD.staff.list,
            },
            { name: onestaffData?.name },
          ]}
        />
        <ChangePassword staffData={onestaffData} />
      </Container>
    </>
  );
}
