/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-boolean-value */
import { CircularProgress, IconButton, MenuItem, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import InvoicePDF from 'pages/dashboard/order/invoice/InvoicePDF';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useUpdateOrderStatusById } from 'services/orderServices';
import { fCurrency } from 'utils/formatNumber';
import { CustomAvatar } from '../../../components/custom-avatar';
import Iconify from '../../../components/iconify';
import LoadingScreen from '../../../components/loading-screen';
import MenuPopover from '../../../components/menu-popover/MenuPopover';
import OrderProductRows from './OrderProductRows';
import OrderStatusDropdown from './OrderStatusDropdown';


OrderTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onDetails: PropTypes.func,
  handleOpen: PropTypes.func,
  handleOpenCancelModal: PropTypes.func,
  handleCodPaymentModal: PropTypes.func,
  downloadInvoice: PropTypes.func,
  filterStatus: PropTypes.string,
  handleExchangeOrderModal: PropTypes.func,
  handleReturnOrderModal: PropTypes.func,
};

export default function OrderTableRow({ row, index, onDetails, handleOpen, handleOpenCancelModal, handleCodPaymentModal, downloadInvoice, filterStatus, handleExchangeOrderModal, handleReturnOrderModal }) {
  const {
    _id,
    orderId,
    orderInvoiceNumber,
    customerDetails,
    orderDetails,
    orderTotal,
    paymentDetails,
    orderStatusTimeline,
    createdAt,
    shiprocketExchangeOrderId,
    shiprocketReturnOrderId,
  } = row;
  console.log("=ww==", row);
  const userId = localStorage.getItem('userId');
  const [orderIndex, setOrderIndex] = useState(null);
  const [viewRow, setViewRow] = useState(false);
  const [age, setAge] = useState('');
  const [openPopover, setOpenPopover] = useState(null);
  const queryClient = useQueryClient();
  const { updateOrderStatus, isLoading: updateOrderIsLoading } = useUpdateOrderStatusById();
  const isOrderDelivered = orderStatusTimeline.some(item => item.status === "SHIPROCKET_DELIVERED");
  const isOrderCancelled = orderStatusTimeline.some(item => item.status === "CANCELLED");

  const [orders, setOrders] = useState([
    { id: 1, status: 'PLACED' },
    { id: 2, status: 'PROCESSING' },
    { id: 3, status: 'PACKED' },
    { id: 4, status: 'SHIPPED' },
    { id: 5, status: 'DELIVERED' },
  ]);

  const attemptedStatuses = ["PLACED", "PROCESSING", "PACKED", "ASSIGN_TO_SHIPROCKET", "SHIPPED", "DELIVERED"];
  const attemptedExchangeStatus = ["EXCHANGE_INITIATED", "EXCHANGE_ACCEPTED", "EXCHANGE_PRODUCT_PICKED_UP", "EXCHANGE_RECEIVED", "EXCHANGE_PROCESSING", "EXCHANGE_PACKED", "EXCHANGE_ASSIGN_TO_SHIPROCKET", "EXCHANGE_SHIPPED", "EXCHANGED"];
  const attemptedReturnedStatus = ["RETURN_INITIATED", "RETURN_ACCEPTED", "RETURN_PRODUCT_PICKED_UP", "RETURN_PROCESSING", "RETURNED"];
  const attemptedCancelledStatus = ["CANCELLED"];

  useEffect(() => {
    setViewRow(false);
  }, [filterStatus])
  const handleChange = (event, updateStatus, orderMode) => {
    if (event.target.value === "DELIVERED" && orderMode === "COD") {
      handleCodPaymentModal(orderId)
    } else if (event.target.value === "EXCHANGE_ASSIGN_TO_SHIPROCKET" && updateStatus === "EXCHANGE_INITIATED") {
      handleExchangeOrderModal(orderId, "EXCHANGE_ASSIGN_TO_SHIPROCKET", row);
    } else if (event.target.value === "RETURNED" && updateStatus === "RETURN_INITIATED") {
      handleReturnOrderModal(orderId, "RETURNED", row);
    } else {
      setAge(event.target.value);
      // console.log(updateStatus, '=setAge=', event.target.value, orderMode);
      const payload = {
        _id,
        // eslint-disable-next-line object-shorthand
        orderId: orderId,
        orderStatus: event.target.value,
        // eslint-disable-next-line object-shorthand
        userId: userId,
        updateStatus: updateStatus,
      };
      if (updateStatus != "") {
        updateOrderStatus(payload, {
          onSuccess: () => queryClient.invalidateQueries(['_getAllOrders']),
        });
      }
    }
  };
  const updateStatus = (updateOrderId, newStatus) => {
    handleChange(newStatus);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updateOrderId ? { ...order, status: newStatus } : order
      )
    );
  };
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
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
  if (updateOrderIsLoading) return <LoadingScreen />;

  return (<>
    <TableRow hover>
      <TableCell align="left">{index + 1}</TableCell>

      <TableCell onClick={() => onDetails()} sx={{ cursor: 'pointer' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <CustomAvatar name={customerDetails?.customerName} />

          <div>
            <Typography variant="subtitle2" noWrap>
              {customerDetails?.customerName}
            </Typography>

            {`ORD-${orderId}`}
            {shiprocketReturnOrderId !== "" ?
              ` (RT-${shiprocketReturnOrderId})` : null}
            {shiprocketExchangeOrderId !== "" ?
              ` (EX-${orderId})` : null}

          </div>
        </Stack>
      </TableCell>
      <TableCell>
        {orderDetails?.orderMode}
        {orderDetails?.orderMode === "ONLINE" ?
          <Stack direction="column" alignItems="left" spacing={1}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {`PAYID-${paymentDetails?.paymentId}`}
            </Typography>
          </Stack> : null}
        <Typography style={{ fontSize: '0.875rem' }}>
          {`INV-${orderInvoiceNumber ? orderInvoiceNumber : orderId}`}
        </Typography>
      </TableCell>
      <TableCell align="center">
        {fCurrency(handleGetPrice(orderTotal))}
        <Stack direction="column" alignItems="left" spacing={1}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {`QTY -  ${orderDetails?.orderTotalQuantity}`} <IconButton variant="text" title="View Product" onClick={() => { setOrderIndex(index); handleViewRow(); }}><Iconify icon="mingcute:down-line" /></IconButton>
          </Typography>

        </Stack>

      </TableCell>

      <TableCell>
        <OrderStatusDropdown
          orderStatus={orderDetails?.orderStatus}
          rowData={row} handleChange={handleChange}
          orderStatusTimeline={orderStatusTimeline}
        />
      </TableCell>


      <TableCell align="left">
        {moment(orderDetails?.orderDate).format('DD-MMM-YYYY')}
        <Stack direction="column" alignItems="left" spacing={1}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {moment(orderDetails?.orderDate).format('hh:mm A')}
          </Typography>

        </Stack>
      </TableCell>


      <TableCell align="right">
        <Stack direction="row" spacing={1}>
          {/* <IconButton variant="text" onClick={() => { setOrderIndex(index); handleViewRow(); }}><Iconify icon="mingcute:down-line" /></IconButton> */}
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton></Stack>
      </TableCell>
    </TableRow>
    {orderIndex === index && viewRow ?
      <OrderProductRows orderData={row || []} filterStatus={filterStatus} />
      : null}
    <MenuPopover
      open={openPopover}
      onClose={handleClosePopover}
      arrow="right-top"
      sx={{ width: 160 }}
    >
      <MenuItem
        onClick={() => {
          // onEditRow();
          handleClosePopover();
          handleOpen();
        }}
      >
        <Iconify icon="carbon:flow-logs-vpc" />
        Order Logs
      </MenuItem>
      {!isOrderDelivered && !isOrderCancelled ?
        <MenuItem
          onClick={() => {
            // onEditRow();
            handleClosePopover();
            handleOpenCancelModal();
          }}
        >
          <Iconify icon="material-symbols:cancel" />
          Cancel Order
        </MenuItem> : null}
      <MenuItem
        onClick={() => {
          handleClosePopover();
          // downloadInvoice();
        }}
      >
        <PDFDownloadLink
          document={<InvoicePDF invoice={row} />}
          fileName={orderId}
          style={{ textDecoration: 'none', color: 'black' }}
        >
          {({ loading }) => (
            <Tooltip title="Download Invoice">

              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (<>
                <Iconify icon="bxs:download" />
                <span style={{ position: 'absolute' }}>Invoice</span>
              </>
              )}
            </Tooltip>
          )}
        </PDFDownloadLink>


      </MenuItem>

    </MenuPopover>

  </>
  );
}
