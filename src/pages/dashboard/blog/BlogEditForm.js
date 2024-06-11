import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { BlogAddForm } from 'sections/@dashboard/blogmanagement';
import { useGetOneBlogById } from 'services/blogServices';
import BlankPage from '../BlankPage';

export default function BlogEditForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: BlogOneData, isLoading, isError } = useGetOneBlogById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Blog: Edit Blog</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a Edit Blog"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Blog',
              href: PATH_DASHBOARD.blog.list,
            },
            { name: BlogOneData.title },
          ]}
        />
        <BlogAddForm isEdit blogData={BlogOneData} />
      </Container>
    </>
  );
}
