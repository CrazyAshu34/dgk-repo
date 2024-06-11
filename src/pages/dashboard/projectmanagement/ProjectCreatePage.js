import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { PATH_DASHBOARD } from 'routes/paths';
import { ProjectAddForm } from 'sections/@dashboard/projectmanagement';

export default function ProjectCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Project: New Project</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Project"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Project',
              href: PATH_DASHBOARD.blog.list,
            },
            { name: 'New Project' },
          ]}
        />
        <ProjectAddForm />
      </Container>
    </>
  );
}
