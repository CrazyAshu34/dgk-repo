import { TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from '../../../../utils/axios';
import { fCurrency } from '../../../../utils/formatNumber';
import styles from './InvoiceStyle';

const StyledRowResult = styled(TableRow)(({ theme }) => ({
    '& td': {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
}));

ProductInvoiceView.propTypes = {
    row: PropTypes.object,
    index: PropTypes.number,
    invoice: PropTypes.object,
    handleGst: PropTypes.func,
};
export default function ProductInvoiceView({ row, index, invoice, handleGst }) {
    const {
        _id,
        orderDetails,
        customerDetails,
        paymentDetails,
        orderId,
        orderSubTotal,
        discountAmount,
        discountType,
        orderShippingCost,
        orderTotal,
        variants,
    } = invoice;
    const [productDetails, setProductDetails] = useState([]);
    const [singlePrice, setSinglePrice] = useState(0);
    const [gstAmount, setGstAmount] = useState(0);
    const [gstPercent, setGstPercent] = useState(0);
    const [productData, setProductData] = useState([]);

    // const { data: productData, isLoading, isError } = useGetProductById(row?.productId);
    const handleProductdetails = async (id) => {
        const response = await axios.get(
            `${process.env.REACT_APP_HOST_API_KEY}/product/oneProduct/${id}`
        );
        if (response?.data?.oneproduct) {
            setProductData(response?.data?.oneproduct)
        }
    }
    useEffect(() => {
        handleProductdetails(row?.productId);

    }, [row?.productId]);
    useEffect(() => {
        if (productData) {
            if (productData[0]?.gsts[0]?.totalGst) {
                // Calculate GST amount (rounding to nearest integer)
                // var gstAmt = Math.round(parseInt(row?.sellingPrice) * (parseInt(productData[0]?.gsts[0]?.totalGst) / 100));
                // Calculate single unit price (price without GST)
                // var singleUnitPrice = Math.round(parseInt(row?.sellingPrice) - gstAmt);
                // Set GST amount, single unit price, and GST percentage in the state
                const singleUnitPrice = row?.sellingPrice / (1 + parseFloat(productData[0]?.gsts[0]?.totalGst) / 100);
                // const gstAmt = parseInt(row?.sellingPrice) * (parseFloat(productData[0]?.gsts[0]?.totalGst) / 100);
                const gstAmt = parseFloat(row?.sellingPrice) - parseFloat(row?.basePrice);
                var sgstAmt = parseFloat(row?.sellingPrice) * (parseFloat(productData[0]?.gsts[0]?.sgst) / 100);
                if (!sgstAmt) {
                    sgstAmt = 0;
                }
                var cgstAmt = parseFloat(row?.sellingPrice) * (parseFloat(productData[0]?.gsts[0]?.igst) / 100);
                if (!cgstAmt) {
                    cgstAmt = 0;
                }
                console.log(productData, "cgstAmt==", cgstAmt);
                setGstAmount(gstAmt);
                setSinglePrice(singleUnitPrice);
                setGstPercent(productData[0]?.gsts[0]?.totalGst);
                handleGst(gstAmt * row?.productQuantity, parseFloat(sgstAmt * row?.productQuantity), parseFloat(cgstAmt * row?.productQuantity));
            } else {
                setSinglePrice(row?.sellingPrice);
            }
        }
    }, [productData]);
    const handleGetPrice = (amount) => {
        const price = amount;
        return parseFloat(price);
    };
    function extractHexColorsFromString(str) {
        // Regular expression for a valid hexadecimal color code
        const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

        // Check if the string matches the pattern
        return hexColorRegex.test(str);
    }
    console.log(row, "productDateeea==", productData);
    return (
        <View style={styles.tableRow} key={index}>
            <View style={styles.tableCell_1}>
                <Text style={styles.body1}>{index + 1}</Text>
            </View>

            <View style={styles.tableCell_5}>
                <Text style={styles.body1}>{row?.productName}</Text>
                {row?.variant?.length > 0
                    ? row?.variant?.map((item) => (
                        <Text style={styles.body1}>
                            {item?.title} : {item?.option}
                        </Text>
                    ))
                    : null}
                {row?.sku ? <Text style={styles.body1}>{`sku: ${row?.sku}`}</Text> : null}
            </View>

            <View style={styles.tableCell_3}>
                <Text style={styles.body1}>{row?.hsnCode}</Text>
            </View>
            <View style={styles.tableCell_3}>
                <Text style={styles.body1}>{fCurrency(handleGetPrice(row?.mrp))}</Text>
            </View>
            <View style={styles.tableCell_3}>
                <Text style={styles.body1}>{fCurrency(handleGetPrice(row?.discount))}</Text>
            </View>
            <View style={styles.tableCell_2}>
                <Text style={styles.body1}>{fCurrency(handleGetPrice(row?.sellingPrice))}</Text>
            </View>
            <View style={styles.tableCell_3}>
                <Text style={styles.body1}>{row?.gst ? `${row?.gst}%` : '0%'}</Text>
            </View>
            <View style={styles.tableCell_3}>
                <Text style={styles.body1}>{fCurrency(handleGetPrice(gstAmount))}</Text>
            </View>
            <View style={styles.tableCell_3}>
                <Text style={styles.body1}>{fCurrency(handleGetPrice(row?.basePrice))}</Text>
            </View>

            <View style={styles.tableCell_3}>
                <Text style={styles.body1}>{row.productQuantity}</Text>
            </View>

            <View style={styles.tableCell_3}>
                <Text style={styles.body1}>{fCurrency(handleGetPrice(row?.basePrice) * row.productQuantity)}</Text>
            </View>
        </View>
    )
}