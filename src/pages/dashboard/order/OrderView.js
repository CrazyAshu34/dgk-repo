import { Container } from '@mui/material'; import { useEffect } from 'react';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useGetOrderById } from 'services/orderServices'
import { useParams, useSearchParams } from 'react-router-dom';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import BlankPage from 'pages/dashboard/BlankPage';
import { PATH_DASHBOARD } from 'routes/paths';
import { OrderViewDetail } from 'sections/@dashboard/order';
import { useQueries, useQuery } from '@tanstack/react-query';


export default function OrderView() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
 
 const { searchParams } = useSearchParams();
  const { data, isLoading: orderIsLoading, isError: orderIsError } = useGetOrderById(id);


  if (orderIsLoading) return <LoadingScreen />;

  if (orderIsError) return <BlankPage />;

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const foo = params.get('pid');
  const pid = foo.split("/")[0];
 console.log(pid,"=orderData==",data);
 const result = data?.ord_product?.cart?.filter(o => o._id.includes(pid));

 console.log(result[0].inputFields);
  
  return (
    <>
      <Helmet>
        <title> Order: Order view</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Order View"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Order', href: PATH_DASHBOARD.order.root },
            // { name: user?.displayName },
          ]}
        />

        <OrderViewDetail inputFields={result[0].inputFields}/>
      </Container>
    </>
  );
}
