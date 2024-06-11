import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { useGetOneProjectById } from 'services/projectServices';
import BlankPage from '../BlankPage';

export default function Detail() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const { data: ProjectOneData, isLoading, isError } = useGetOneProjectById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Project: Detail Project</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Detail Project"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Project',
              href: PATH_DASHBOARD.project.list,
            },
            { name: ProjectOneData.project_title },
          ]}
        />
        {/* <ProjectDetailsPage projectData={ProjectOneData} id={id} /> */}
      </Container>
    </>
  );
}
