import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { PATH_DASHBOARD } from 'routes/paths';
import { DiscountAddForm } from 'sections/@dashboard/discount';

export default function DiscountCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Dashboard: New Dashboard</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Coupon"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Coupon',
              href: PATH_DASHBOARD.discount.list,
            },
            { name: 'New Coupon' },
          ]}
        />
        <DiscountAddForm />
      </Container>
    </>
  );
}
