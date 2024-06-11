import { Container, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { SeoIllustration } from 'assets/illustrations';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import { useSettingsContext } from 'components/settings';
import SvgColor from 'components/svg-color/SvgColor';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AppWelcome, AppWidgetSummary } from 'sections/@dashboard/general/app';
import { useGetAllContact } from 'services/contactServices';
import { useGetAllOrders } from 'services/orderServices';
import { useGetAllProductEnquiry } from 'services/productServices';
import { PATH_DASHBOARD } from '../../../routes/paths';
import BlankPage from '../BlankPage';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  category: icon('ic_category'),
  subcategory: icon('ic_sub_category'),
  supercategory: icon('ic_super_category'),
  exchange: icon('ic_exchange'),
  return: icon('ic_return'),
};

export default function GeneralAppPage() {
  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  const {
    data: contactenquiriess,
    isLoading: contactIsLoading,
    isError: contactIsError,
  } = useGetAllContact();
  const [newOrders, setNewOrders] = useState([]);
  const [exchangeOrders, setExchangeOrders] = useState([]);
  const [returnOrders, setReturnOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const { data: orders, isLoading: ordersIsLoading, isError: ordersIsError } = useGetAllOrders();

  const {
    data: productEnquiryStatus,
    isLoading: productEnquiryIsLoading,
    isError: productEnquiryIsError,
  } = useGetAllProductEnquiry();

  useEffect(() => {
    if (orders && orders?.length > 0) {
      const newOrderData = orders?.filter((order) =>
        order.orderStatusTimeline.some(entry => entry.status === "PLACED") &&
        !order.orderStatusTimeline.some(entry => entry.status === "PROCESSING") &&
        !order.orderStatusTimeline.some(entry => entry.status === "PACKED") &&
        !order.orderStatusTimeline.some(entry => entry.status === "ASSIGN_TO_SHIPROCKET") &&
        !order.orderStatusTimeline.some(entry => entry.status === "EXCHANGE_INITIATED") &&
        !order.orderStatusTimeline.some(entry => entry.status === "RETURN_INITIATED") &&
        !order.orderStatusTimeline.some(entry => entry.status === "CANCELLED")
      );
      setNewOrders(newOrderData);
      const exchangeOrderData = orders?.filter((order) =>
        order.orderStatusTimeline.some(entry => entry.status === "EXCHANGE_INITIATED")
      );
      setExchangeOrders(exchangeOrderData);

      const returnOrderData = orders?.filter((order) =>
        order.orderStatusTimeline.some(entry => entry.status === "RETURN_INITIATED")
      );
      setReturnOrders(returnOrderData);
    }
  }, [orders]);

  if (contactIsLoading || productEnquiryIsLoading || ordersIsLoading)
    return <LoadingScreen />;

  if (contactIsError || productEnquiryIsError || ordersIsError)
    return <BlankPage />;




  console.log('productEnquiryStatus', productEnquiryStatus);

  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome
              title={`Welcome To! \n ${process.env.REACT_APP_COMPANY_NAME} Backend Panel`}
              description="As an Admin Panel user, you now have access to a wealth of resources and functionality to help you run your website smoothly and effectively."
              img={
                <SeoIllustration
                  sx={{
                    p: 2,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Link to={PATH_DASHBOARD.contact.root} style={{ textDecoration: 'none' }}>
              <AppWidgetSummary
                title="Contact Enquires"
                icon={ICONS.mail}
                percent={2.6}
                total={contactenquiriess.length || 0}
                totalNewNotify={
                  contactenquiriess.filter((item) => item.viewStatus === 0).length || 0
                }
                chartColor={theme.palette.error.main}
                chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
              />
            </Link>
          </Grid>

          <Grid item xs={12} md={4}>
            <Link to={PATH_DASHBOARD.productenquries.root} style={{ textDecoration: 'none' }}>
              <AppWidgetSummary
                title="Product Enquires"
                icon={ICONS.mail}
                percent={2.6}
                total={productEnquiryStatus.length || 0}
                totalNewNotify={
                  productEnquiryStatus.filter((item) => item.viewStatus === 0).length || 0
                }
                chartColor={theme.palette.primary.main}
                chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
              />
            </Link>
          </Grid>

          <Grid item xs={12} md={4}>
            <Link to={PATH_DASHBOARD.order.list('PLACED')} style={{ textDecoration: 'none' }}>
              <AppWidgetSummary
                title="Total Orders"
                icon={ICONS.cart}
                percent={2.6}
                total={orders.length || 0}
                totalNewNotify={orders.filter((item) => item.viewStatus === false).length || 0}
                chartColor={theme.palette.success.main}
                chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
              />
            </Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <Link to={PATH_DASHBOARD.order.list('PLACED')} style={{ textDecoration: 'none' }}>
              <AppWidgetSummary
                title="New Orders"
                icon={ICONS.cart}
                percent={2.6}
                total={newOrders.length || 0}
                totalNewNotify={newOrders.filter((item) => item.viewStatus === false).length || 0}
                chartColor={theme.palette.primary.main}
                chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
              />
            </Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <Link to={PATH_DASHBOARD.order.list('EXCHANGE_INITIATED')} style={{ textDecoration: 'none' }}>
              <AppWidgetSummary
                title="Exchange"
                icon={ICONS.exchange}
                percent={2.6}
                total={exchangeOrders.length || 0}
                totalNewNotify={exchangeOrders.filter((item) => item?.exchangeDetails?.viewStatus === false).length || 0}
                chartColor={theme.palette.warning.main}
                chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
              />
            </Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <Link to={PATH_DASHBOARD.order.list('RETURN_INITIATED')} style={{ textDecoration: 'none' }}>
              <AppWidgetSummary
                title="Return"
                icon={ICONS.return}
                percent={2.6}
                total={returnOrders.length || 0}
                totalNewNotify={returnOrders.filter((item) => item?.returnDetails?.viewStatus === false).length || 0}
                chartColor={theme.palette.error.main}
                chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
              />
            </Link>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
