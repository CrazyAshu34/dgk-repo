import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { PATH_DASHBOARD } from 'routes/paths'; 
import { GstAddForm } from 'sections/@dashboard/gst';

export default function GstCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Dashboard: New Dashboard</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New GST"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'GST',
              href: PATH_DASHBOARD.gst.list,
            },
            { name: 'New GST' },
          ]}
        />
        <GstAddForm />
      </Container>
    </>
  );
}
