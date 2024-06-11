import { Container, Grid, Typography } from '@mui/material';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { useGetAllDeleteCustomersRecyclebin } from 'services/customerServices';
import { useGetAllDeleteStaffRecyclebin } from 'services/staffServices';
import { useGetAllDeleteCategoriesRecyclebin } from 'services/categoryServices';

import { useGetAllDeleteProductRecyclebin } from 'services/productServices';
import CategoriesRecycleBin from '../../../sections/@dashboard/category/CategoriesRecycleBin';
import ProductRecycleBin from '../../../sections/@dashboard/product/ProductRecycleBin';
import CustomerRecycleBin from '../../../sections/@dashboard/customer/CustomerRecycleBin';
import StaffRecycleBin from '../../../sections/@dashboard/staff/StaffRecycleBin';




// import { useGetAllDeleteSubCategoriesRecyclebin } from 'services/subCategoryServices';
// import { useGetAllDeleteSuperSubCategoriesRecyclebin } from 'services/superSubCategoryServices';
import { useSettingsContext } from '../../../components/settings';
import BlankPage from '../BlankPage';

export default function GeneralAnalyticsPage() {
  const { themeStretch } = useSettingsContext();

  const {
    data: StaffData,
    isLoading: staffIsLoading,
    isError: staffIsError,
  } = useGetAllDeleteStaffRecyclebin();
  const {
    data: Productdata,
    isLoading: productIsLoading,
    isError: productIsError,
  } = useGetAllDeleteProductRecyclebin();
  const {
    data: CustomersData,
    isLoading: customersIsLoading,
    isError: customersError,
  } = useGetAllDeleteCustomersRecyclebin();

  const {
    data: Categories,
    isLoading: categoryIsLoading,
    isError: categoryIsError,
  } = useGetAllDeleteCategoriesRecyclebin();
//   const {
//     data: SubCategoryData,
//     isLoading: subCategoryIsLoading,
//     isError: subCategoryIsError,
//   } = useGetAllDeleteSubCategoriesRecyclebin();
//   const {
//     data: superSubCategoryData,
//     isLoading: superSubCategoryIsLoading,
//     isError: superSubCategoryIsError,
//   } = useGetAllDeleteSuperSubCategoriesRecyclebin();

//   if (
//     staffIsLoading ||
//     productIsLoading ||
//     customersIsLoading ||
//     categoryIsLoading ||
//     subCategoryIsLoading ||
//     superSubCategoryIsLoading
//   )
//     return <LoadingScreen />;

//   if (
//     staffIsError ||
//     productIsError ||
//     customersError ||
//     categoryIsError ||
//     subCategoryIsError ||
//     superSubCategoryIsError
//   )
//     return <BlankPage />;

   console.log("Categories==",Categories);
  return (
    <>
      <Helmet>
        <title>Recycle Bin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Recycle Bin
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Link to={PATH_DASHBOARD.recyclebin.stafflist} style={{ textDecoration: 'none' }}>
              <StaffRecycleBin title="Staff" total={StaffData?.length} icon="ph:users-three-fill" />
            </Link>
          </Grid> 

          <Grid item xs={12} sm={6} md={3}> 
            <Link to={PATH_DASHBOARD.recyclebin.customerlist} style={{ textDecoration: 'none' }}>
              <CustomerRecycleBin
                title="Customer"
                total={CustomersData?.length}
                color="info"
                icon="mdi:customer-service"
              />
            </Link>
          </Grid>

          {/* <Grid item xs={12} sm={6} md={3}>
            <Link to={PATH_DASHBOARD.recyclebin.productlist} style={{ textDecoration: 'none' }}>
              <ProductRecycleBin
                title="Product"
                total={Productdata?.length}
                color="warning"
                icon="ic:round-shopping-cart"
              />
            </Link>
          </Grid> */}

          {/* <Grid item xs={12} sm={6} md={3}>
            <Link to={PATH_DASHBOARD.recyclebin.categorieslist} style={{ textDecoration: 'none' }}>
              <CategoriesRecycleBin
                title="Categories"
                total={Categories?.length}
                color="error"
                icon="carbon:collapse-categories"
              />
            </Link>
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
