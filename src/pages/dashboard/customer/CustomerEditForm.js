import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths'; 
import CustomerAddForm from 'sections/@dashboard/customer/CustomerAddForm';
import { useGetOneCustomerById } from 'services/customerServices';
import BlankPage from '../BlankPage';

export default function CustomerEditForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: customerData, isLoading, isError } = useGetOneCustomerById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Customer: Edit Customer</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a Edit Customer"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            { name: 'Customer', href: PATH_DASHBOARD.customer.root },
            { name: customerData?.name },
          ]}
        />
        <CustomerAddForm isEdit customerData={customerData} />
      </Container>
    </>
  );
}
