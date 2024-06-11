import { Grid, Stack, Box, Tabs, Tab } from '@mui/material';
import LoadingScreen from 'components/loading-screen';
import BlankPage from 'pages/dashboard/BlankPage';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Iconify from 'components/iconify';
import {
  useGetOrderAddressCustomerById,
  useGetWishlistCustomerId,
  useGetCartCustomerId,
} from '../../../services/customerServices';
import DealerAbout from './DealerAbout';
import DealerFollowInfo from './DealerFollowInfo';
import Orderhistory from './Orderhistory';
import Carthistory from './Carthistory';
import Wishlisthistory from './Wishlisthistory';

Dealer.propTypes = {
  dealerData: PropTypes.object,
};

export default function Dealer({ dealerData }) {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState('orderhistory');

  const { data: orderData, isLoading, isError } = useGetOrderAddressCustomerById(id);
  const {
    data: wishlistData,
    isLoading: wishlistLoading,
    isError: wishlistError,
  } = useGetWishlistCustomerId(id);

  const { data: cartData, isLoading: cartLoading, isError: cartError } = useGetCartCustomerId(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  const TABS = [
    {
      value: 'orderhistory',
      label: 'Order History',
      icon: <Iconify icon="ic:round-list" />,
      component: (
        <Orderhistory
          title="Order History"
          tableData={orderData}
          tableLabels={[
            { id: 'ord_id', label: 'Or Id' },
            { id: 'ord_payid', label: 'Raz Id' },
            { id: 'ord_quantity', label: 'Quantity', align: 'center' },
            { id: 'ord_amount', label: 'Amount', align: 'center' },
            { id: 'ord_status', label: 'Status' },
            { id: 'ord_date', label: 'Date' },
          ]}
        />
      ),
    },
    {
      value: 'cart',
      label: 'Cart',
      icon: <Iconify icon="ic:round-add-shopping-cart" />,
      component: (
        <Carthistory
          title="Cart"
          tableData={cartData}
          tableLabels={[
            { id: 'product_img', label: '' },
            { id: 'product_name', label: 'Product Name' },
            { id: 'p_quantity', label: 'Quantity', align: 'center' },
            { id: 'p_amount', label: 'Amount', align: 'center' },
            { id: 'total_amount', label: 'Total Amount' },
            { id: 'date', label: 'Date' },
          ]}
        />
      ),
    },
    {
      value: 'wishlist',
      label: 'Wish List',
      icon: <Iconify icon="il:heart" />,
      component: (
        <Wishlisthistory
          title="Wish List"
          tableData={wishlistData}
          tableLabels={[
            { id: 'product_img', label: '' },
            { id: 'product_name', label: 'Product Name' },
            { id: 'price', label: 'Price' },
            { id: 'date', label: 'Date' },
          ]}
        />
      ),
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <DealerFollowInfo orderData={orderData} />
          <DealerAbout dealerData={dealerData} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        <Box
          sx={{
            mb: 3,
            height: 50,
            position: 'relative',
          }}
        >
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              width: 1,
              bottom: 0,
              zIndex: 9,
              position: 'absolute',
              bgcolor: 'background.paper',
              '& .MuiTabs-flexContainer': {
                pr: { md: 3 },
                justifyContent: {
                  sm: 'center',
                  md: 'flex-end',
                },
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        {TABS.map(
          (tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>
        )}
        {/* <Orderhistory
          title="Order History"
          tableData={orderData}
          tableLabels={[
            { id: 'ord_id', label: 'Or Id' },
            { id: 'ord_payid', label: 'Raz Id' },
            { id: 'ord_quantity', label: 'Quantity', align: 'center' },
            { id: 'ord_amount', label: 'Amount', align: 'center' },
            // { id: 'ord_city', label: 'City' },
            { id: 'ord_status', label: 'Status' },
            { id: 'ord_date', label: 'Date' },
          ]}
        /> */}
      </Grid>
    </Grid>
  );
}
