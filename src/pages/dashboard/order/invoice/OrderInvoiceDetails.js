import {
  Box,
  Card,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import BlankPage from 'pages/dashboard/BlankPage';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { useGetOrderById } from 'services/orderServices';
import { fCurrency } from 'utils/formatNumber';
import Image from '../../../../components/image';
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
import { fDate } from '../../../../utils/formatTime';
import GstAmount from './GstAmount';
import InvoiceToolbar from './InvoiceToolbar';
import OrderProduct from './OrderProducts';

const StyledRowResult = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------
AddressDetails.propTypes = {
  id: PropTypes.string,
};
export function AddressDetails({ customer, rajya }) {
  console.log('customer==', customer);
  // const { data, isLoading, isError } = useGetAddressById(id);
  // if (isLoading) console.log('Loading...');
  // if (isError) console.log('Error...');
  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
        {customer?.customerName}
      </Typography>
      <Typography variant="body2" sx={{ textTransform: 'capitalize' }} style={{ marginTop: '0px' }}>
        <span style={{ fontWeight: 'bold' }}>Address:</span> {customer?.customerAddress?.address}
      </Typography>
      <Typography variant="body2" sx={{ textTransform: 'capitalize' }} style={{ marginTop: '0px' }}>
        <span style={{ fontWeight: 'bold' }}>Landmark:</span> {customer?.customerAddress?.landMark}
      </Typography>
      {/* <Typography
        variant="body2"
        sx={{ textTransform: 'capitalize' }}
        style={{ marginTop: '0px', fontWeight: 'bold' }}
      >
        {customer?.customerAddress?.addressType}
      </Typography> */}
      <Typography variant="body2" sx={{ textTransform: 'capitalize' }} style={{ marginTop: '0px' }}>
        <span style={{ fontWeight: 'bold' }}> City: </span> {customer?.customerAddress?.city}
      </Typography>
      <Typography variant="body2" sx={{ textTransform: 'capitalize' }} style={{ marginTop: '0px' }}>
        <span style={{ fontWeight: 'bold' }}> State: </span> {rajya}
      </Typography>

      <Typography variant="body2" sx={{ textTransform: 'capitalize' }} style={{ marginTop: '0px' }}>
        <span style={{ fontWeight: 'bold' }}> Pincode: </span>
        {customer?.customerAddress?.pincode}
      </Typography>
      <Typography variant="body2" sx={{ textTransform: 'capitalize' }} style={{ marginTop: '0px' }}>
        <span style={{ fontWeight: 'bold' }}> Phone:</span> +91-{customer?.customerNumber}
      </Typography>
    </Stack>
  );
}
//--------------------------------------------------------------------------
OrderInvoiceDetails.propTypes = {
  invoice: PropTypes.object,
};

export default function OrderInvoiceDetails({ invoice }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading: orderIsLoading, isError: orderIsError } = useGetOrderById(id);
  const [companyName, setCompanyName] = useState(process.env.REACT_APP_COMPANY_NAME);
  const [isIgst, setIsIgst] = useState(false);
  const [rajya, setRajya] = useState('');
  const [productSubTotal, setProductSubTotal] = useState(0);
  const [companyMObile, setCompanyMobile] = useState(process.env.REACT_APP_COMPANY_CONTACT);
  const [companyEmail, setCompanyEmail] = useState(process.env.REACT_APP_COMPANY_EMAIL);
  const [isMapComplete, setIsMapComplete] = useState(false);
  const [productRows, setProductRows] = useState([]);
  const [totalGst, setTotalGst] = useState(0);
  const [companyAddress, setCompanyAddress] = useState(
    process.env.REACT_APP_COMPANY_ADDRESS
  );
  const [companyWebsite, setCompanyWebsite] = useState(process.env.REACT_APP_COMPANY_DOMAIN);
  console.log('data123456', data);
  function arraysMatch(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    const titles1 = arr1.map(item => item);
    const titles2 = arr2.map(item => item);

    titles1.sort();
    titles2.sort();

    for (let i = 0; i < titles1.length; i++) {
      if (titles1[i] !== titles2[i]) {
        return false;
      }
    }

    return true;
  }



  useEffect(() => { }, [totalGst]);
  var basePrice = 0;
  const pinheaders = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Connection': 'keep-alive'
  }
  const handleIgst = async (pincode) => {
    console.log("pincodeData=", pincode);
    // const pincodeData = await axios.get(
    //   `https://api.postalpincode.in/pincode/110001`,
    //   { headers: pinheaders }
    // );
    // console.log("pincodeData=", pincodeData);
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(async (responseData) => {
        // Handle the API response
        if (responseData) {
          console.log("pincodeData=", responseData[0]?.PostOffice[0]?.Circle);
          setRajya(responseData[0]?.PostOffice[0]?.Circle);
          if (responseData[0]?.PostOffice[0]?.Circle !== "Chattisgarh") {
            setIsIgst(true);
          }
        }
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      });
  }
  useEffect(() => {

    if (data) {
      const exchangeInitiatedIndex = data?.orderStatusTimeline.findIndex(item => item.status === "EXCHANGE_INITIATED");
      const isExchangeInitiated = data?.orderStatusTimeline.some(item => item.status === "EXCHANGE_INITIATED");

      const returnInitiatedIndex = data?.orderStatusTimeline.findIndex(item => item.status === "RETURN_INITIATED");
      const isReturnInitiated = data?.orderStatusTimeline.some(item => item.status === "RETURN_INITIATED");

      // if (orderData && filterStatus === "EXCHANGE_INITIATED") {
      if (exchangeInitiatedIndex !== -1 && isExchangeInitiated) {
        // const matchedProducts = orderData.orderDetails.orderedProducts.filter(product => {
        //     return orderData.exchangeDetails.exchangeProducts.some(exchangeProduct => exchangeProduct.productId === product.productId);
        // });
        const matchedProducts = data.orderDetails.orderedProducts.map((product) => {
          const exchangeProduct = data.exchangeDetails?.exchangeProducts?.find((exProduct) => {
            const orderProductVariantTitle = product?.variant.map(data => data.title);
            const orderProductVariantValue = product?.variant.map(data => data.option);
            const exProductVariantTitle = exProduct?.variant.map(data => data.title);
            const exProductVariantValue = exProduct?.variant.map(data => data.option);
            return exProduct.productId === product.productId && (
              (exProduct.variant.length === 0 && product.variant.length === 0) ||
              (exProduct.variant.length > 0 && product.variant.length > 0 && arraysMatch(orderProductVariantTitle, exProductVariantTitle) && arraysMatch(orderProductVariantValue, exProductVariantValue))
            );
          });

          if (exchangeProduct) {
            return { ...product, isExchange: true, reason: exchangeProduct.reason };
          } else {
            return { ...product, isExchange: false, reason: null };
          }
        });

        setProductRows(matchedProducts);
      } else if (returnInitiatedIndex !== -1 && isReturnInitiated) {
        const matchedProducts = data.orderDetails.orderedProducts.map((product) => {
          const returnProduct = data.returnDetails?.returnProducts?.find((rtProduct) => {

            const orderProductVariantTitle = product?.variant.map(data => data.title);
            const orderProductVariantValue = product?.variant.map(data => data.option);
            const rtProductVariantTitle = rtProduct?.variant.map(data => data.title);
            const rtProductVariantValue = rtProduct?.variant.map(data => data.option);
            return rtProduct.productId === product.productId && (
              (rtProduct.variant.length === 0 && product.variant.length === 0) ||
              (rtProduct.variant.length > 0 && product.variant.length > 0 && arraysMatch(orderProductVariantTitle, rtProductVariantTitle) && arraysMatch(orderProductVariantValue, rtProductVariantValue))
            );
          });

          if (returnProduct) {
            return { ...product, isReturn: true, reason: returnProduct.reason };
          } else {
            return { ...product, isReturn: false, reason: null };
          }
        });
        setProductRows(matchedProducts);
      } else {
        setProductRows(data.orderDetails.orderedProducts);
      }
      const totalGSTAmount = data.orderDetails.orderedProducts.reduce((total, item) => {
        const gstRate = parseFloat(item.gst) / 100;
        const gstAmount = item.amount * gstRate;
        return total + gstAmount;
      }, 0);
      const basePrice = data.orderDetails.orderedProducts.reduce((total, product) => {
        return total + (product?.basePrice * product?.productQuantity);
      }, 0);
      setProductSubTotal(basePrice);
      handleIgst(data?.customerDetails?.customerAddress?.pincode);
    }

  }, [data]);


  if (orderIsLoading) return <LoadingScreen />;

  if (orderIsError) return <BlankPage />;

  const {
    _id,
    orderDetails,
    customerDetails,
    paymentDetails,
    orderId,
    orderInvoiceNumber,
    orderSubTotal,
    discountAmount,
    discountType,
    orderShippingCost,
    orderTotal,
    variants,
    orderStatusTimeline,
    exchangeDetails,
    returnDetails,
    refundDetails,
  } = data;

  const handleGetPrice = (amount) => {
    // console.log('cartPrice=', item?.[`${cust_type}Rows`][0]?.perProductPrice);
    const price = amount;
    console.log('fsdf', price);
    return Number(price);
  };
  const handleView = (viewid) => {
    navigate(PATH_DASHBOARD.order.view(`${_id}?pid=${viewid}`));
  };
  function arraysMatch(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    const titles1 = arr1.map(item => item);
    const titles2 = arr2.map(item => item);

    titles1.sort();
    titles2.sort();

    for (let i = 0; i < titles1.length; i++) {
      if (titles1[i] !== titles2[i]) {
        return false;
      }
    }

    return true;
  }
  const handleGst = (amt) => {
    setTotalGst(totalGst + amt);
  }


  return (
    <>
      <InvoiceToolbar invoice={data} isIgst={isIgst} rajya={rajya} />
      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Image
              disabledEffect
              alt="logo"
              src="https://technolitics-s3-bucket.s3.ap-south-1.amazonaws.com/tasarikasilks-s3-bucket/favicon.png"
              style={{ maxWidth: '15%' }}
            />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Label
                variant="soft"
                color={
                  (orderDetails?.orderStatus === 'PLACED' && 'default') ||
                  (orderDetails?.orderStatus === 'PROCESSING' && 'info') ||
                  (orderDetails?.orderStatus === 'SHIPPED' && 'success') ||
                  (orderDetails?.orderStatus === 'DELIVERED' && 'success') ||
                  (orderDetails?.orderStatus === 'EXCHANGE_INITIATED' && 'info') ||
                  (orderDetails?.orderStatus === 'RETURN_INITIATED' && 'info') ||
                  (orderDetails?.orderStatus === 'PRODUCT_PICKED_UP' && 'warning') ||
                  (orderDetails?.orderStatus === 'RETURNED' && 'success') ||
                  (orderDetails?.orderStatus === 'EXCHANGED' && 'success') ||
                  (orderDetails?.orderStatus === 'CANCELLED' && 'error') ||
                  'default'
                }
                sx={{ textTransform: 'uppercase', mb: 1 }}
              >
                {orderDetails?.orderStatus}
              </Label>

              <Typography variant="h6">{`Invoice No. : ${orderInvoiceNumber ? orderInvoiceNumber : orderId}`}</Typography>
              <Typography >{`Order Id : ${orderId}`}</Typography>
              <Typography>{`Date Created : ${fDate(orderDetails?.orderDate)}`}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} sx={{ mb: 5, p: 2 }}>
            <Typography paragraph variant="overline">
              Invoice from
            </Typography>
            <Stack spacing={2}>
              <Typography sx={{ textTransform: 'capitalize' }}>{companyName}</Typography>

              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                {companyAddress}
              </Typography>

              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                <span style={{ fontWeight: 'bold' }}> Phone:</span> +91-{companyMObile}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4} sx={{ mb: 5, p: 2 }}>
            <Typography paragraph variant="overline">
              INVOICE TO
            </Typography>
            <AddressDetails customer={customerDetails} rajya={rajya} />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ mb: 5, p: 2 }}>
            <Typography paragraph variant="overline">
              PAYMENT
            </Typography>
            <Typography
              variant="body2"
              sx={{ textTransform: 'capitalize' }}
              style={{ marginTop: '0px' }}
            >
              <span style={{ fontWeight: 'bold' }}>Order Mode:</span> {orderDetails?.orderMode}
            </Typography>
            {orderDetails?.orderMode == 'ONLINE' ? (
              <Typography
                variant="body2"
                sx={{ textTransform: 'capitalize' }}
                style={{ marginTop: '0px' }}
              >
                <span style={{ fontWeight: 'bold' }}>Transaction Id:</span>{' '}
                {paymentDetails?.paymentId}
              </Typography>
            ) : null}

            {returnDetails?.isInitiated === true ? (
              <Grid>
                <Typography
                  variant="body2"
                  sx={{ textTransform: 'uppercase' }}
                  style={{ marginTop: '10px', marginBottom: '10px' }}
                >
                  <span style={{ fontWeight: 'bold', color: 'blue' }}>Return Payment Detail</span>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textTransform: 'capitalize' }}
                  style={{ marginTop: '0px' }}
                >
                  <span style={{ fontWeight: 'bold' }}>R/f Method:</span> {refundDetails?.refundMethod === "DIRECT_BANK_TRANSFER" ? "DIRECT BANK TRANSFER" : "UPI"}
                </Typography>
                {refundDetails?.refundMethod === "DIRECT_BANK_TRANSFER" ?
                  <div>
                    <Typography
                      variant="body2"
                      sx={{ textTransform: 'capitalize' }}
                      style={{ marginTop: '0px' }}
                    >
                      <span style={{ fontWeight: 'bold' }}>A/C Name:</span> {refundDetails?.bankDetails?.accountHolderName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ textTransform: 'capitalize' }}
                      style={{ marginTop: '0px' }}
                    >
                      <span style={{ fontWeight: 'bold' }}>A/C No.:</span> {refundDetails?.bankDetails?.accountNumber}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ textTransform: 'capitalize' }}
                      style={{ marginTop: '0px' }}
                    >
                      <span style={{ fontWeight: 'bold' }}>Bank Name:</span> {refundDetails?.bankDetails?.bankName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ textTransform: 'capitalize' }}
                      style={{ marginTop: '0px' }}
                    >
                      <span style={{ fontWeight: 'bold' }}>IFSC Code:</span> {refundDetails?.bankDetails?.ifscCode}
                    </Typography>
                  </div>
                  :
                  <div>
                    <Typography
                      variant="body2"
                      sx={{ textTransform: 'capitalize' }}
                      style={{ marginTop: '0px' }}
                    >
                      <span style={{ fontWeight: 'bold' }}>UPI ID:</span> {refundDetails?.upiDetails?.upiId}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ textTransform: 'capitalize' }}
                      style={{ marginTop: '0px' }}
                    >
                      <span style={{ fontWeight: 'bold' }}>UPI Name:</span> {refundDetails?.upiDetails?.upiName}
                    </Typography>
                  </div>
                }
              </Grid>) : null}

          </Grid>
        </Grid>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>

                  <TableCell align="left" width={40}>
                    IMAGE
                  </TableCell>
                  <TableCell align="left">
                    PRODUCT
                  </TableCell>
                  <TableCell align="left">HSN</TableCell>
                  <TableCell align="right">MRP</TableCell>
                  <TableCell align="right">DISC.</TableCell>
                  <TableCell align="right">SALE PRICE</TableCell>
                  <TableCell align="right">GST%</TableCell>
                  <TableCell align="right">GST AMT.</TableCell>

                  <TableCell align="right">UNIT PRICE</TableCell>
                  <TableCell align="right" width={15}>QTY</TableCell>
                  <TableCell align="right">TOTAL</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {productRows?.map((row, index) => (
                  <OrderProduct row={row} index={index} handleGst={handleGst} />

                ))}

              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TableContainer sx={{ overflow: 'unset' }}>

          <Table sx={{ minWidth: 960 }}>
            <TableBody>
              <StyledRowResult>
                <TableCell colSpan={9} />

                <TableCell align="left" width={160} sx={{ typography: 'body1' }}>
                  <Box sx={{ mt: 2 }} />
                  Sub Total
                </TableCell>
                <TableCell align="right" width={120} sx={{ typography: 'body1' }}>
                  <Box sx={{ mt: 2 }} />
                  {fCurrency(productSubTotal)}
                </TableCell>
              </StyledRowResult>
              {/* GST AMT, discount AND GRAND TOTAL */}
              <GstAmount productRows={productRows} productSubTotal={productSubTotal} discountAmount={discountAmount} discountType={discountType} isIgst={isIgst} />

            </TableBody>
          </Table>

        </TableContainer>
        <Divider sx={{ mt: 5 }} />
        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">Thank you!</Typography>

            <Typography variant="body2">
              <Link rel="noreferrer" target="_blank" to={process.env.REACT_APP_COMPANY_DOMAIN}>
                {process.env.REACT_APP_COMPANY_DOMAIN}
              </Link>
            </Typography>
          </Grid>

          <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
            <Typography variant="subtitle2">Have a Question?</Typography>

            <Typography variant="body2">
              <a rel="noreferrer" href={`mailTo:${companyEmail}`}>
                {companyEmail}
              </a>
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
