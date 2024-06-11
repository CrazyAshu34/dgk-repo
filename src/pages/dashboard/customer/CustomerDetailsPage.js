import { Card, Container } from '@mui/material';
import { _userAbout } from '_mock/arrays';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { Customer, CustomerCover } from 'sections/@dashboard/customer';
import { useGetOneCustomerById } from 'services/customerServices';
import BlankPage from '../BlankPage';

export default function Detail() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: customerData, isLoading, isError } = useGetOneCustomerById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;
  return (
    <>
      <Helmet>
        <title>Customer: Customer Details</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Customer Details"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Customer',
              href: PATH_DASHBOARD.customer.list,
            },
            { name: customerData?.name || '' },
          ]}
        />

        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          <CustomerCover customerData={customerData} myProfile={_userAbout} />
        </Card>

        <Customer myProfile={_userAbout} customerData={customerData} />
      </Container>
    </>
  );
}
