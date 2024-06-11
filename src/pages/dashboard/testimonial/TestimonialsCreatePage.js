import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { PATH_DASHBOARD } from 'routes/paths';
import { TestimonialsAddForm } from 'sections/@dashboard/testimonials';

export default function StaffCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Testimonials: New Testimonials</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new Testimonials"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Testimonials',
              href: PATH_DASHBOARD.testimonials.list,
            },
            {
              name: 'New Testimonials',
            },
          ]}
        />
        <TestimonialsAddForm />
      </Container>
    </>
  );
}
