import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { PATH_DASHBOARD } from 'routes/paths';
import { BannerAddForm } from 'sections/@dashboard/banner';

export default function BannerCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Banner : New Banner</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Banner"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Banner',
              href: PATH_DASHBOARD.banner.list,
            },
            { name: 'New Banner' },
          ]}
        />
        <BannerAddForm />
      </Container>
    </>
  );
}
