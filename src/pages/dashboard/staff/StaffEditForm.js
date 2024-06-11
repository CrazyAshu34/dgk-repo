import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { StaffEditForm } from 'sections/@dashboard/staff';
import { useGetOneStaffById } from 'services/staffServices';
import BlankPage from '../BlankPage';

export default function Edit() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const { data: staffData, isLoading, isError } = useGetOneStaffById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;
  console.log('staffData', staffData);

  return (
    <>
      <Helmet>
        <title>Staff: Edit Staff</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Staff"
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
        <StaffEditForm isEdit staffData={staffData} />
      </Container>
    </>
  );
}
