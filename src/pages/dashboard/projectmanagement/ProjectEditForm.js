import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { ProjectAddForm } from 'sections/@dashboard/projectmanagement';
import { useGetOneProjectById } from 'services/projectServices';
import BlankPage from '../BlankPage';

export default function BlogEditForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: ProjectOneData, isLoading, isError } = useGetOneProjectById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Project: Edit Project</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Project"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Projects',
              href: PATH_DASHBOARD.project.list,
            },
            { name: ProjectOneData.name },
          ]}
        />
        <ProjectAddForm isEdit projectData={ProjectOneData} />
      </Container>
    </>
  );
}
