import { Paper, TableCell, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { fCurrency } from 'utils/formatNumber';
import axios from '../../../../utils/axios';

const StyledRowResult = styled(TableRow)(({ theme }) => ({
    '& td': {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
}));

GstAmount.propTypes = {
    productRows: PropTypes.array,
    productSubTotal: PropTypes.number,

    discountAmount: PropTypes.number,
    discountType: PropTypes.string,
    isIgst: PropTypes.bool,
};
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
}));

export default function GstAmount({ productRows, productSubTotal, discountAmount, discountType, isIgst }) {

    const [totalGst, setTotalGst] = useState(0);
    const [grandTotalGst, setGrandTotalGst] = useState(0);
    const [totalSGst, setTotalSGst] = useState(0);
    const [totalCGst, setTotalCGst] = useState(0);
    const getProductDetails = async (productRows) => {
        let finalTotalGst = 0;
        const gstPromises = productRows?.map(async (row) => {
            const productData = await axios.get(
                `${process.env.REACT_APP_HOST_API_KEY}/product/oneProduct/${row?.productId}`
            );

            if (productData?.data?.oneproduct[0]?.gsts[0]?.totalGst) {
                // const singleUnitPrice = row?.sellingPrice / (1 + parseFloat(productData?.data?.oneproduct[0]?.gsts[0]?.totalGst) / 100);
                // const gstAmt = parseFloat(row?.sellingPrice) * (parseFloat(productData?.data?.oneproduct[0]?.gsts[0]?.totalGst) / 100);
                const gstAmt = parseFloat(row?.sellingPrice) - parseFloat(row?.basePrice);
                var sgstAmt = parseFloat(row?.sellingPrice) * (parseFloat(productData?.data?.oneproduct[0]?.gsts[0]?.sgst) / 100);
                if (!sgstAmt) {
                    sgstAmt = 0;
                }
                var cgstAmt = parseFloat(row?.sellingPrice) * (parseFloat(productData?.data?.oneproduct[0]?.gsts[0]?.igst) / 100);
                if (!cgstAmt) {
                    cgstAmt = 0;
                }
                var tempTotalGst = parseFloat(gstAmt * row?.productQuantity);
                finalTotalGst += tempTotalGst;
                setGrandTotalGst(finalTotalGst);
                console.log("finalTotalGst=", finalTotalGst);
                return `${parseFloat(gstAmt * row?.productQuantity)} || ${parseFloat(sgstAmt * row?.productQuantity)} || ${parseFloat(cgstAmt * row?.productQuantity)} || ${finalTotalGst}`;
            }

            return 0;
        });

        const gstValues = await Promise.all(gstPromises);
        console.log(grandTotalGst, "grandTotalGst=", gstValues);
        var gstArr = [];
        if (gstValues?.length > 0) {
            if (gstValues[0]) {
                gstArr = gstValues[0]?.split('||');
            }
        }
        // Sum up all the GST values and update the state
        // const totalGstValue = parseFloat(gstArr[0]).reduce((acc, curr) => acc + curr, 0);
        const totalGstValue = parseFloat(gstArr[0]);
        const totalSGstValue = parseFloat(gstArr[1]);
        const totalCGstValue = parseFloat(gstArr[2]);
        setTotalSGst(totalSGstValue);
        setTotalCGst(totalCGstValue);
        setTotalGst(finalTotalGst);
    }
    useEffect(() => {
        if (productRows) {
            // productRows?.map((row) =>
            getProductDetails(productRows)
            // console.log("sdfsdfsdf==", row)
            // )
        }
    }, [productRows]);
    const handleGetPrice = (amount) => {
        // console.log('cartPrice=', item?.[`${cust_type}Rows`][0]?.perProductPrice);
        const price = amount;
        return Number(price);
    };
    var discamt = 0;
    if (discountAmount > 0) {
        discamt = discountType === "PERCENTAGE" ? ((parseFloat(productSubTotal) + parseFloat(totalGst)) * discountAmount / 100) : discountAmount;
    }
    const tempTotal = (parseFloat(productSubTotal) + parseFloat(totalGst)) - parseFloat(discamt);
    const roundUp = Math.ceil(tempTotal) - parseFloat(tempTotal);
    const grandTotal = parseFloat(tempTotal) + parseFloat(roundUp);


    // console.log("productRows=", grandTotalGst, totalGst);
    return (<>
        {isIgst ?
            <StyledRowResult>
                <TableCell colSpan={9} />

                <TableCell align="left" width={160} sx={{ typography: 'body1' }}>

                    IGST Total
                </TableCell>

                <TableCell align="right" width={120} sx={{ typography: 'body1' }}>

                    {fCurrency(totalGst)}
                </TableCell>
            </StyledRowResult>
            :
            <>
                <StyledRowResult>
                    <TableCell colSpan={9} />

                    <TableCell align="left" width={160} sx={{ typography: 'body1' }}>

                        SGST Total
                    </TableCell>

                    <TableCell align="right" width={120} sx={{ typography: 'body1' }}>

                        {fCurrency(totalGst / 2)}
                    </TableCell>
                </StyledRowResult>

                <StyledRowResult>
                    <TableCell colSpan={9} />

                    <TableCell align="left" width={160} sx={{ typography: 'body1' }}>
                        CGST Total
                    </TableCell>
                    <TableCell align="right" width={120} sx={{ typography: 'body1' }}>

                        {fCurrency(totalGst / 2)}
                    </TableCell>
                </StyledRowResult>
            </>
        }
        {discountAmount > 0 ?
            <StyledRowResult>
                <TableCell colSpan={9} />

                <TableCell align="left" width={160} sx={{ typography: 'body1' }}>
                    Coupon Discount
                </TableCell>

                <TableCell
                    align="right"
                    width={120}
                    sx={{ color: 'info.main', typography: 'body1' }}
                >
                    {discountType === 'PERCENTAGE'
                        ? `${fCurrency((productSubTotal + totalGst) * discountAmount / 100)}`
                        : fCurrency(discountAmount)}
                </TableCell>

            </StyledRowResult>
            : null}
        <StyledRowResult>
            <TableCell colSpan={9} />

            <TableCell align="left" width={160} sx={{ typography: 'body1' }}>
                Round Off
            </TableCell>

            <TableCell align="right" width={140} sx={{ typography: 'body1' }}>
                {fCurrency(roundUp)}
            </TableCell>
        </StyledRowResult>
        <StyledRowResult>
            <TableCell colSpan={9} />

            <TableCell align="left" width={160} sx={{ typography: 'h6' }}>
                Grand Total
            </TableCell>

            <TableCell align="right" width={140} sx={{ typography: 'h6' }}>
                {fCurrency(grandTotal)}
            </TableCell>
        </StyledRowResult>
    </>
    );
}; 
