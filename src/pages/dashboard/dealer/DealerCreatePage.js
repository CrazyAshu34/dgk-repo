import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { DealerAddForm } from '../../../sections/@dashboard/dealer';

export default function DealerCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Dealer Management: New Dealer Management</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Dealer Management"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Dealer Management',
              href: PATH_DASHBOARD.dealer.list,
            },
            { name: 'New Dealer Management' },
          ]}
        />
        <DealerAddForm />
      </Container>
    </>
  );
}
