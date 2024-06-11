import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { StaffDetailsPage } from 'sections/@dashboard/staff';
import { useGetOneStaffById } from 'services/staffServices';
import BlankPage from '../BlankPage';

export default function Detail() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const { data: staffData, isLoading, isError } = useGetOneStaffById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Staff: Detail Staff</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Detail Staff"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Staff',
              href: PATH_DASHBOARD.staff.list,
            },
            { name: staffData?.name },
          ]}
        />
        <StaffDetailsPage staffData={staffData} />
      </Container>
    </>
  );
}
