import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { TestimonialsAddForm } from 'sections/@dashboard/testimonials';
import { useGetOneTestimonialsById } from 'services/testimonialsServices';
import BlankPage from '../BlankPage';

export default function Edit() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: testimonialsData, isLoading, isError } = useGetOneTestimonialsById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Testimonials: Edit Testimonials</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Testimonials"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Testimonials',
              href: PATH_DASHBOARD.testimonials.list,
            },
            { name: testimonialsData?.test_name },
          ]}
        />
        <TestimonialsAddForm isEdit testimonialsData={testimonialsData} />
      </Container>
    </>
  );
}
