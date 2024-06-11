import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import CustomerAddAmcForm from 'sections/@dashboard/customer/CustomerAddAmcForm';

export default function CustomerAddProductAmcForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  console.log("fdsf");
  return (
    <>
      <Helmet>
        <title>Add Product Amc : New Add Product Amc</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Add Product Amc"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            { name: 'Add Product Amc', href: PATH_DASHBOARD.customer.root },
            { name: 'New Add Product Amc' },
          ]}
        />
        <CustomerAddAmcForm id={id} />
      </Container>
    </>
  );
}
