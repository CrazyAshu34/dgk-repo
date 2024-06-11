import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { PATH_DASHBOARD } from 'routes/paths';
import CustomerAddForm from 'sections/@dashboard/customer/CustomerAddForm';

export default function CustomerCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Customer: New Customer</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Customer"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            { name: 'Customer', href: PATH_DASHBOARD.customer.root },
            { name: 'New Customer' },
          ]}
        />
        <CustomerAddForm />
      </Container>
    </>
  );
}
