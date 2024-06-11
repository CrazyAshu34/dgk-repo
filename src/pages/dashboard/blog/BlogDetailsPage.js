import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { BlogDetailsPage } from 'sections/@dashboard/blogmanagement';
import { useGetOneBlogById } from 'services/blogServices';
import BlankPage from '../BlankPage';

export default function Detail() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const { data: BlogOneData, isLoading, isError } = useGetOneBlogById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Blog: Detail Blog</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Detail Blog"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Blog',
              href: PATH_DASHBOARD.blog.list,
            },
            { name: BlogOneData.blog_title },
          ]}
        />
        <BlogDetailsPage blogData={BlogOneData} id={id} />
      </Container>
    </>
  );
}
