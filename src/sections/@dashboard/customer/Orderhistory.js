import PropTypes from 'prop-types';
// @mui
import {
  Card,
  CardHeader,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { fCurrency } from 'utils/formatNumber';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { TableHeadCustom } from '../../../components/table';
import OrderViewProductRows from './tab/OrderViewProductRows';

Orderhistory.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
};

export default function Orderhistory({ title, tableData, tableLabels, ...other }) {
  const navigate = useNavigate();
  const handleDetailsViewRow = (id) => {
    navigate(PATH_DASHBOARD.order.invoice(id));
  };
  console.log("tableData=", tableData);
  return (
    <Card {...other}>
      <CardHeader title={title} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 720 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData?.map((row, index) => (
                <OrderHistoryRow key={row.id} index={index} row={row} onDetails={() => handleDetailsViewRow(row?.orderId)} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

// ----------------------------------------------------------------------

OrderHistoryRow.propTypes = {
  row: PropTypes.object,
  onDetails: PropTypes.func,
  index: PropTypes.number,
};

function OrderHistoryRow({ row, onDetails, index }) {
  const theme = useTheme();
  const {
    _id,
    orderId,
    customerDetails,
    orderDetails,
    paymentDetails,
    orderStatusTimeline,
    createdAt,
    shiprocketExchangeOrderId,
    shiprocketReturnOrderId,
  } = row;
  const [viewRow, setViewRow] = useState(false);
  const [orderIndex, setOrderIndex] = useState(null);
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleViewRow = () => {
    if (viewRow === true) {
      setViewRow(false);
    } else {
      setViewRow(true);
    }
  }
  const handleGetPrice = (amount) => {
    // console.log('cartPrice=', item?.[`${cust_type}Rows`][0]?.perProductPrice);
    const price = amount;
    return Number(price);
  };
  return (
    <>
      <TableRow>
        <TableCell onClick={() => onDetails()} sx={{ cursor: 'pointer' }}>
          {orderId}
          {shiprocketReturnOrderId !== "" ?
            ` (RT-${shiprocketReturnOrderId})` : null}
          {shiprocketExchangeOrderId !== "" ?
            ` (EX-${orderId})` : null}
        </TableCell>

        <TableCell>
          {orderDetails?.orderMode}
          {orderDetails?.orderMode === "ONLINE" ?
            <Stack direction="column" alignItems="left" spacing={1}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {paymentDetails?.paymentId}
              </Typography>
            </Stack> : null}
        </TableCell>

        <TableCell align="center">
          {fCurrency(handleGetPrice(orderDetails?.orderTotal))}
          <Stack direction="column" alignItems="left" spacing={1}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {`QTY -  ${orderDetails?.orderTotalQuantity}`}
              <IconButton variant="text" title="View Product" onClick={() => { setOrderIndex(index); handleViewRow(); }}>
                <Iconify icon="mingcute:down-line" />
              </IconButton>
            </Typography>

          </Stack>
        </TableCell>
        <TableCell align="left">
          {orderDetails?.orderStatus}
        </TableCell>
        <TableCell align="left">
          {moment(orderDetails?.orderDate).format('DD-MMM-YYYY')}
          <Stack direction="column" alignItems="left" spacing={1}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {moment(orderDetails?.orderDate).format('hh:mm A')}
            </Typography>

          </Stack>
        </TableCell>
      </TableRow>
      {orderIndex === index && viewRow ?
        <OrderViewProductRows orderData={row || []} filterStatus="" fCurrency={fCurrency} />
        : null}
    </>
  );
}
