import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { DesignationAddForm } from 'sections/@dashboard/designation';
import { useGetOneDesignationById } from 'services/designationServices';
import BlankPage from '../BlankPage';

export default function DesignationEditForm() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const { data, isLoading, isError } = useGetOneDesignationById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;
  return (
    <>
      <Helmet>
        <title>Designation : Edit Designation</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Designation"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Designation',
              href: PATH_DASHBOARD.designation.list,
            },
            { name: data?.designation_name },
          ]}
        />

        <DesignationAddForm data={data} isEdit />
      </Container>
    </>
  );
}
