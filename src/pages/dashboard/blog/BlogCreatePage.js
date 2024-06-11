import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { PATH_DASHBOARD } from 'routes/paths';
import { BlogAddForm } from 'sections/@dashboard/blogmanagement';

export default function BlogCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Blog: New Blog</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Blog"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Blog',
              href: PATH_DASHBOARD.blog.list,
            },
            { name: 'New Blog' },
          ]}
        />
        <BlogAddForm />
      </Container>
    </>
  );
}
