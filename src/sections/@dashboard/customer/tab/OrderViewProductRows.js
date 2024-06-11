import { Box, Chip, Paper, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Image from '../../../../components/image';

OrderViewProductRows.propTypes = {
    orderData: PropTypes.object,
    filterStatus: PropTypes.string,
    fCurrency: PropTypes.func,
};
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
}));

export default function OrderViewProductRows({ orderData, filterStatus, fCurrency }) {
    const [productRows, setProductRows] = useState([]);
    const cellStyle = {
        width: '100% !important',
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
    useEffect(() => {
        const exchangeInitiatedIndex = orderData?.orderStatusTimeline.findIndex(item => item.status === "EXCHANGE_INITIATED");
        const isExchangeInitiated = orderData?.orderStatusTimeline.some(item => item.status === "EXCHANGE_INITIATED");

        const returnInitiatedIndex = orderData?.orderStatusTimeline.findIndex(item => item.status === "RETURN_INITIATED");
        const isReturnInitiated = orderData?.orderStatusTimeline.some(item => item.status === "RETURN_INITIATED");

        if (exchangeInitiatedIndex !== -1 && isExchangeInitiated) {
            const matchedProducts = orderData.orderDetails.orderedProducts.map((product) => {
                const exchangeProduct = orderData.exchangeDetails.exchangeProducts.find((exProduct) => {
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
            const matchedProducts = orderData.orderDetails.orderedProducts.map((product) => {
                const returnProduct = orderData.returnDetails.returnProducts.find((rtProduct) => {
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
            setProductRows(orderData.orderDetails.orderedProducts);
        }
    }, [orderData]);
    const handleGetPrice = (amount) => {
        // console.log('cartPrice=', item?.[`${cust_type}Rows`][0]?.perProductPrice);
        const price = amount;
        return Number(price);
    };
    console.log("productRows=", productRows);
    return (<>
        {productRows?.map((row, index) => (

            <TableRow
                key={index}
                sx={{
                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                }
                }
                style={{ background: '#f4f6f8' }}
            >

                < TableCell > <Image disabledEffect alt="logo" src={row?.images[0]} sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }} /></TableCell >
                <TableCell align="left" >
                    <Box sx={{ maxWidth: 560 }}>
                        <Typography variant="subtitle2" >
                            {row?.productName}

                            < /Typography>

                            {
                                row?.variant?.length > 0 ?
                                    row?.variant?.map(item =>
                                        <>
                                            <small>
                                                {item?.title.toUpperCase()} : {item?.option.toUpperCase()}
                                                < /small>{"\n"}</ >
                                            )
                                            : null
}
                                            {row?.sku ? <p style={{ margin: '0' }}> <small>{`SKU: ${row?.sku}`} </small></p > : null}
                                            {
                                                row?.isExchange ?
                                                    <Stack direction="row" spacing={1} >
                                                        <Chip label="Exchange" color="success" style={{ cursor: "default" }
                                                        } title={row?.reason} variant="outlined" />
                                                    </Stack>
                                                    : null}
                                            {
                                                row?.isReturn ?
                                                    <Stack direction="row" spacing={1} >
                                                        <Chip label="Return" color="warning" style={{ cursor: "default" }
                                                        } title={row?.reason} variant="outlined" />
                                                    </Stack>
                                                    : null}
                                        </Box >
    < /TableCell>


                                    < TableCell align = "center" > { row.productQuantity } < /TableCell>

                                    < TableCell align = "right" >

                                    { fCurrency(handleGetPrice(row?.sellingPrice * row.productQuantity))}
                        </TableCell>
                        <TableCell align="left" > </TableCell>
                        < /TableRow>
                        ))
        }</>
                    );
}; 
