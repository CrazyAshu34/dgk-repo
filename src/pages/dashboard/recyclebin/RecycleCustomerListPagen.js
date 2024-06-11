import { Box, Container, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PATH_DASHBOARD } from 'routes/paths';
// components
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import { useSettingsContext } from 'components/settings';
import { CustomerList, DealerList } from 'sections/@dashboard/recyclebin'; 
import { useGetAllDeleteCustomersRecyclebin } from 'services/customerServices';
import BlankPage from '../BlankPage';

export default function RecycleCustomerListPage() {
  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('customer');

  const {
    data,
    isLoading: customersIsLoading,
    isError: customersError,
  } = useGetAllDeleteCustomersRecyclebin();

  const TABS = [
    {
      // value: `category ${Categories.length}`,
      value: 'customer',
      label: `(${data?.length}) Customer`,
      // icon: <Iconify icon="mdi:category" />,
      component: <CustomerList />,
    },
    // {
    //   value: 'dealer',
    //   label: `Dealer`,
    //   // icon: <Iconify icon="carbon:category-new" />,
    //   component: <DealerList />,
    // },
  ];

  if (customersIsLoading)
    return <LoadingScreen />;

  if (customersError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title> Customer List Recycle Bin </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Customer List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'All Customer', href: PATH_DASHBOARD.customer.list },
          ]}
        />

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
              '& .MuiTabs-flexContainer': {
                pr: { md: 3 },
                justifyContent: {
                  sm: 'center',
                  md: 'flex-start',
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
      </Container>
    </>
  );
}
