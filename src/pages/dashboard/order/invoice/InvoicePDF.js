import { TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Document, Image, Page, Text, View } from '@react-pdf/renderer';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { fCurrency } from '../../../../utils/formatNumber';
import styles from './InvoiceStyle';
import ProductInvoiceView from './ProductInvoiceView';

const StyledRowResult = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

InvoicePDF.propTypes = {
  invoice: PropTypes.object,
};

export default function InvoicePDF({ invoice }) {
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
  } = invoice;
  const { id } = useParams();
  const [rajya, setRajya] = useState('');
  const [isIgst, setIsIgst] = useState(false);
  const [totalGst, setTotalGst] = useState(null);
  const [totalSGst, setTotalSGst] = useState(0);
  const [totalCGst, setTotalCGst] = useState(0);
  const [productSubTotal, setProductSubTotal] = useState(0);
  const [companyName, setCompanyName] = useState(process.env.REACT_APP_COMPANY_NAME);
  const [companyMObile, setCompanyMobile] = useState(process.env.REACT_APP_COMPANY_CONTACT);
  const [companyEmail, setCompanyEmail] = useState(process.env.REACT_APP_COMPANY_EMAIL);
  const [companyAddress, setCompanyAddress] = useState(
    process.env.REACT_APP_COMPANY_ADDRESS
  );

  const [companyWebsite, setCompanyWebsite] = useState(process.env.REACT_APP_COMPANY_DOMAIN);
  const handleIgst = async (pincode) => {
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
    if (invoice) {
      const basePrice = orderDetails.orderedProducts.reduce((total, product) => {
        return total + (product?.basePrice * product?.productQuantity);
      }, 0);
      setProductSubTotal(basePrice);
      handleIgst(invoice?.customerDetails?.customerAddress?.pincode);
    }
  }, [invoice])
  const handleGetPrice = (amount) => {
    const price = amount;
    return parseFloat(price);
  };
  const handleGst = (amt, sgstamt, cgstamt) => {
    setTotalGst(totalGst + amt);
    setTotalSGst(totalSGst + sgstamt);
    setTotalCGst(totalCGst + cgstamt);
  }
  var discamt = 0;
  if (discountAmount > 0) {
    discamt = discountType === "PERCENTAGE" ? ((parseFloat(productSubTotal) + parseFloat(totalGst)) * discountAmount / 100) : discountAmount;
  }
  // const tempTotal = (parseFloat(productSubTotal) - parseFloat(discamt)) + parseFloat(totalGst);
  const tempTotal = (parseFloat(productSubTotal) + parseFloat(totalGst)) - parseFloat(discamt);
  const roundUp = Math.ceil(tempTotal) - parseFloat(tempTotal);
  const grandTotal = parseFloat(tempTotal) + parseFloat(roundUp);
  console.log("totalCGst==", totalCGst);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            position: 'absolute',

            right: 20,
            top: -25,
            bottom: 0,
          }}
        >
          <Image
            source="https://technolitics-s3-bucket.s3.ap-south-1.amazonaws.com/tasarikasilks-s3-bucket/tasarikasilks.png"
            style={{ height: '120px' }}
          />
        </View>
        <View style={[styles.mb8]}>
          <Text style={[styles.h3, styles.mb8, styles.alignCenter]}>Invoice </Text>
        </View>
        <View style={[styles.gridContainer, styles.mb8, styles.mt10]}>

          <View style={styles.col3}>
            <View >
              <Text style={[styles.overline]}>Invoice No. : </Text>
              <Text style={[styles.body1]}>{orderInvoiceNumber ? orderInvoiceNumber : orderId}</Text>
              <Text style={[styles.overline]}>Order Date : </Text>
              <Text style={[styles.body1]}>{moment(orderDetails?.orderDate).format('DD.MM.YYYY')}</Text>
            </View>
          </View>
          <View style={styles.col3}>
            <View >
              <Text style={[styles.overline]}>Order Id : </Text>
              <Text style={[styles.body1]}>{orderId}</Text>
              <Text style={[styles.overline]}>PAYMENT MODE</Text>
              <Text style={[styles.body1]}>{orderDetails?.orderMode}</Text>
              {orderDetails?.orderMode == 'ONLINE' ?
                <>
                  <Text style={[styles.overline]}>PAYMENT ID</Text>
                  <Text style={[styles.body1]}>{paymentDetails?.paymentId}</Text>
                </> : null}
            </View>
          </View>

          <View style={styles.col6}>
            <View>
              <Text style={[styles.overline, styles.alignRight]}>Sold By :</Text>
              <Text style={[styles.body1, styles.alignRight]}>{process.env.REACT_APP_COMPANY_NAME}</Text>
              <Text style={[styles.body1, styles.alignRight]}>Shop Number 90, Mahalaxmi Market, Main Rd, Sector 4, Pandri,</Text>
              <Text style={[styles.body1, styles.alignRight]}>Raipur C.G., Chhattisgarh 492001</Text>
              <Text style={[styles.body1, styles.alignRight]}>{process.env.REACT_APP_COMPANY_GST}</Text>
            </View>
            {/* <View>
              <Text style={styles.body2}>{companyAddress}</Text>
            </View> */}

            {/* <View >
              <Text style={styles.overline}>GSTIN : </Text>
              <Text style={styles.body2}>AA220923013383L</Text>
            </View> */}
          </View>


        </View>
        <View style={[styles.gridContainer, styles.mb8]}>

          <View style={styles.col6}>
            <Text style={[styles.overline]}>Bill To,</Text>
            <Text style={[styles.subtitle3, styles.textTransformUp]}>{customerDetails.customerName}</Text>
            <Text style={styles.body1}>
              {customerDetails?.customerAddress?.address},
              {customerDetails?.customerAddress?.landMark}{' '}
              {customerDetails?.customerAddress?.city},
            </Text>
            <Text style={styles.body1}>
              {rajya}, {customerDetails?.customerAddress?.pincode}
            </Text>
            <Text style={styles.body1}>Ph: +91 {customerDetails?.customerNumber}</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableHeadCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>

              <View style={styles.tableHeadCell_5}>
                <Text style={styles.subtitle3}>PRODUCT</Text>
              </View>

              <View style={styles.tableHeadCell_3}>
                <Text style={styles.subtitle3}>HSN</Text>
              </View>
              <View style={styles.tableHeadCell_3}>
                <Text style={styles.subtitle3}>MRP</Text>
              </View>
              <View style={styles.tableHeadCell_3}>
                <Text style={styles.subtitle3}>DISC.</Text>
              </View>

              <View style={styles.tableHeadCell_2}>
                <Text style={styles.subtitle3}>SALE PRICE</Text>
              </View>
              <View style={styles.tableHeadCell_3}>
                <Text style={styles.subtitle3}>GST%</Text>
              </View>
              <View style={styles.tableHeadCell_3}>
                <Text style={styles.subtitle3}>GST AMT.</Text>
              </View>
              <View style={styles.tableHeadCell_3}>
                <Text style={styles.subtitle3}>UNIT PRICE</Text>
              </View>
              <View style={styles.tableHeadCell_3}>
                <Text style={styles.subtitle3}>QTY</Text>
              </View>

              <View style={[styles.tableHeadCell_3]}>
                <Text style={styles.subtitle3}>TOTAL</Text>
              </View>
            </View>
          </View>
          <View style={styles.tableBody}>
            {orderDetails?.orderedProducts?.map((row, index) => (
              <ProductInvoiceView row={row} index={index} invoice={invoice} handleGst={handleGst} />
            ))}

          </View>

        </View>
        <View style={styles.table}>
          <View style={styles.tableBody}>
            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_4} />
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3} />
              <View style={{ width: '50%', borderTop: '1px solid black', textAlign: 'left', paddingTop: '10px' }}>
                <Text style={styles.body1}>SUB TOTAL</Text>
              </View>
              <View style={{ width: '25%', borderTop: '1px solid black', textAlign: 'right', paddingTop: '10px' }}>
                <Text style={styles.body1} >
                  {' '}
                  {fCurrency(
                    productSubTotal
                  )}{' '}
                </Text>
              </View>
            </View>

            {isIgst ?
              <View style={[styles.tableRow, styles.noBorder]}>
                <View style={styles.tableCell_4} />
                <View style={styles.tableCell_1} />
                <View style={styles.tableCell_2} />
                <View style={styles.tableCell_3} />
                <View style={styles.tableCell_3} />
                <View style={[styles.tableCell_5, styles.alignLeft]}>
                  <Text style={styles.body1}>IGST TOTAL</Text>
                </View>
                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text style={styles.body1}>
                    {fCurrency(totalGst)}
                  </Text>
                </View>
              </View>
              :
              <>
                <View style={[styles.tableRow, styles.noBorder]}>
                  <View style={styles.tableCell_4} />
                  <View style={styles.tableCell_1} />
                  <View style={styles.tableCell_2} />
                  <View style={styles.tableCell_3} />
                  <View style={styles.tableCell_3} />
                  <View style={[styles.tableCell_5, styles.alignLeft]}>
                    <Text style={styles.body1}>SGST TOTAL</Text>
                  </View>
                  <View style={[styles.tableCell_3, styles.alignRight]}>
                    <Text style={styles.body1}>
                      {fCurrency(totalGst / 2)}
                    </Text>
                  </View>
                </View>
                <View style={[styles.tableRow, styles.noBorder]}>
                  <View style={styles.tableCell_4} />
                  <View style={styles.tableCell_1} />
                  <View style={styles.tableCell_2} />
                  <View style={styles.tableCell_3} />
                  <View style={styles.tableCell_3} />
                  <View style={[styles.tableCell_5, styles.alignLeft]}>
                    <Text style={styles.body1}>CGST TOTAL</Text>
                  </View>
                  <View style={[styles.tableCell_3, styles.alignRight]}>
                    <Text style={styles.body1}>
                      {fCurrency(totalGst / 2)}
                    </Text>
                  </View>
                </View>
              </>
            }
            {discountAmount > 0 ?
              <View style={[styles.tableRow, styles.noBorder]}>
                <View style={styles.tableCell_4} />
                <View style={styles.tableCell_1} />
                <View style={styles.tableCell_2} />
                <View style={styles.tableCell_3} />
                <View style={styles.tableCell_3} />
                <View style={[styles.tableCell_5, styles.alignLeft]}>
                  <Text style={styles.body1}>COUPON DISCOUNT</Text>
                </View>
                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text style={styles.body1}>

                    {discountType === 'PERCENTAGE'
                      ? `${fCurrency((productSubTotal + totalGst) * discountAmount / 100)}`
                      : fCurrency(discountAmount)}
                  </Text>
                </View>
              </View>
              : null}
            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_4} />
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3} />
              <View style={[styles.tableCell_5, styles.alignLeft]}>
                <Text style={styles.body1}>ROUND OFF</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.body1}>
                  {fCurrency(roundUp)}
                </Text>
              </View>
            </View>
            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_4} />
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3} />
              <View style={[styles.tableCell_5, styles.alignLeft]}>
                <Text style={styles.overline}>GRAND TOTAL</Text>
              </View>
              <View style={{ width: '25%', textAlign: 'right', backgroundColor: '#fff2cc', paddingTop: '3px' }}>
                <Text style={styles.overline}>
                  {' '}
                  {fCurrency(
                    grandTotal
                  )}{' '}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.footer, styles.flexCenter]}>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle3}>Thank you</Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text
              style={{
                color: '#3c7adc',
                fontSize: 10,
                fontWeight: '400',
              }}
            >
              Have any Questions ?

            </Text>
          </View>


          <View style={[styles.flexCenter, styles.mb8, styles.mt10]}>
            <View style={styles.flexContainer}>

              <Text style={styles.body1}>
                At {process.env.REACT_APP_COMPANY_NAME} we try to deliver perfectly each and every time. But in the
                off-chance that you need to return the item, please do so with the original Brand
                box/price tag, original packing and invoice without which it will be really
                difficult for us to act on your request. Please help us in helping you. Terms and
                conditions apply.
              </Text>
            </View>
          </View>
          <View style={{ width: '100%' }}>
            <View style={[styles.mb8, styles.flexContainer]}>
              <Text style={styles.subtitle2}>For any queries, please contact us at </Text>
              <Text style={styles.subtitle2}>{companyEmail}</Text>

            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
