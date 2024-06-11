import {
  Box,
  Card,
  Container,
  Table, TableBody,
  TableContainer,
  Typography
} from '@mui/material';
import Modal from '@mui/material/Modal';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import { useSettingsContext } from 'components/settings';
import BlankPage from 'pages/dashboard/BlankPage';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { OrderCancelReason, OrderLogs } from 'sections/@dashboard/order';
import CodOrderDelivered from 'sections/@dashboard/order/CodOrderDelivered';
import OrderExchange from 'sections/@dashboard/order/OrderExchange';
import OrderReturnModel from 'sections/@dashboard/order/OrderReturnModel';
import OrderTableRow from 'sections/@dashboard/order/OrderTableRow';
import OrderTableToolbar from 'sections/@dashboard/order/OrderTableToolbar';
import { useCancelOrderById, useGetAllOrders, useUpdateOderViewStatus } from 'services/orderServices';
import { useGetOneUserById } from 'services/userServices';
import Scrollbar from '../../../components/scrollbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  emptyRows,
  getComparator,
  useTable,
} from '../../../components/table';
import SubTabs from './subTabs';

const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { id: 'ord_id', label: 'NAME AND ID', align: 'left' },
  { id: 'ord_payment_status', label: 'PAYMENT MODE & INVID', align: 'left', width: 150 },
  { id: 'ord_value', label: 'ORDER VALUE', align: 'left' },
  { id: 'ord_status', label: 'STATUS', align: 'left' },
  { id: 'ord_date', label: 'DATE ', align: 'left' },
  { id: '' },
];

const headers = [
  { label: 'ORDER ID', key: 'orderId' },
  { label: 'STATUS', key: 'orderDetails.orderStatus' },
  { label: 'ORDER MODE', key: 'orderDetails.orderMode' },
  { label: 'PAYMENT STATUS', key: 'paymentDetails.paymentStatus' },
  { label: 'PAY MODE', key: 'paymentDetails.paymentMethod' },
  { label: 'NAME', key: 'customerDetails.customerName' },
  { label: 'MOBILE NUMBER', key: 'customerDetails.customerNumber' },
  { label: 'QUANTITY', key: 'orderDetails.orderTotalQuantity' },
  { label: 'TOTAL AMOUNT', key: 'orderDetails.orderTotal' },
  { label: 'DATE', key: 'orderDetails.orderDate' },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



export default function UserProfilePage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { type } = useParams();
  const { themeStretch } = useSettingsContext();
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useGetOneUserById(userId);
  const [filterName, setFilterName] = useState('');
  const [getDownload, setGetDownload] = useState([]);
  const [subTabs, setSubTabs] = useState([]);
  const [orderTimeLine, setOrderTimeLine] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [shiprocketTableData, setShiprocketTableData] = useState([]);
  const [shiprocketOrderData, setShiprocketOrderData] = useState([]);
  const [filterStatus, setFilterStatus] = useState('PLACED');
  const [subTabsFilterStatus, setSubTabsFilterStatus] = useState('PLACED');
  const [open, setOpen] = React.useState(false);
  const [openCancelModal, setOpenCancelModal] = React.useState(false);
  const [orderId, setOrderId] = useState('');
  const [shiprocketOrderCount, setShiprocketOrderCount] = useState(0);
  const [orderMode, setOrderMode] = useState('');
  const [openCodPaymentModal, setOpenCodPaymentModal] = useState(false);
  const [openOrderExchangeModal, setOpenOrderExchangeModal] = useState(false);
  const [openOrderReturnModal, setOpenOrderReturnModal] = useState(false);
  const [orderData, setOrderData] = useState({});
  const handleOpen = (timeline) => {
    setOrderData(timeline);
    setOpen(true);

  }
  const { data, isLoading: orderIsLoading, isError: orderIsError } = useGetAllOrders();
  const { updateOdersViewStatus } = useUpdateOderViewStatus();
  const { cancelOrder } = useCancelOrderById();
  const handleClose = () => {
    setOpen(false); setOpenCancelModal(false);
    setOpenCodPaymentModal(false);
    setOpenOrderExchangeModal(false);
    setOpenOrderReturnModal(false);
  }
  const handleOpenCancelModal = (cancelOrderId, ordMode) => {
    setOrderMode(ordMode);
    setOrderId(cancelOrderId);
    setOpenCancelModal(true);
  }
  const handelCancelOrder = (payload) => {
    cancelOrder(payload);
  }
  const handleFilterStatus = (event, newValue) => {
    setSubTabsFilterStatus(newValue);
    setPage(0);
    setFilterStatus(newValue);
  };
  const handleSubTabsFilterStatus = (event, newValue) => {
    setSubTabsFilterStatus(newValue);
  };
  useEffect(() => {
    if (data?.length > 0) {
      setTableData(data);
      setGetDownload(data);
    }
  }, [data]);
  useEffect(() => {
    const payload = {
      viewStatus: true,
      orderStatus: type,
    };
    updateOdersViewStatus(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(),
    filterName,
    filterStatus,
    subTabsFilterStatus
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered?.length && !!filterName) || (!dataFiltered?.length && !!filterStatus) || (!dataFiltered?.length && !!subTabsFilterStatus);

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const handleDetailsViewRow = (id) => {
    navigate(PATH_DASHBOARD.order.invoice(id));
  };
  const downloadInvoice = (invoiceData) => {
    console.log("invoice=", invoiceData?._id);
    navigate(PATH_DASHBOARD.order.invoice(invoiceData?.orderId));
  }
  const handleCodPaymentModal = (ordid) => {
    setOpenCodPaymentModal(true);
    setOrderId(ordid);
  }
  const handleExchangeOrderModal = (ordid, status, order) => {
    setOpenOrderExchangeModal(true);
    setOrderId(ordid);
    setOrderData(order);
  }

  const handleReturnOrderModal = (ordid, status, order) => {
    setOpenOrderReturnModal(true);
    setOrderId(ordid);
    setOrderData(order);
  }
  if (orderIsLoading) return <LoadingScreen />;

  if (orderIsError) return <BlankPage />;

  const getLengthBySubTabsStatus = (subTabsStatus) => {
    // if (tableData?.length > 0) {
    console.log("oooooooo", subTabsStatus);
    let filteredData = tableData;
    // if (subTabsStatus === "EXCHANGE_INITIATED" || subTabsStatus === "EXCHANGE_INITIATED") {
    //   filteredData = tableData.filter((item2) => {
    //     return !shiprocketOrdersData.some((item1) => item1.channel_order_id === item2.orderId);
    //   });
    // }
    // console.log("filteredData==", filteredData);
    return filteredData?.filter(order =>
      order.orderDetails.orderStatus === subTabsStatus
    ).length;
    // }
  }
  function getShipRocketOrderLength(num) {

    return num;
  }
  return (
    <>
      <Helmet>
        <title> Order: Order Management</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <SubTabs getShipRocketOrderLength={getShipRocketOrderLength} dataFiltered={dataFiltered} filterStatus={filterStatus} handleFilterStatus={handleFilterStatus} subTabsFilterStatus={subTabsFilterStatus} handleSubTabsFilterStatus={handleSubTabsFilterStatus} getLengthBySubTabsStatus={getLengthBySubTabsStatus} type={type} />
          {tableData?.length || shiprocketTableData.length ? (
            <OrderTableToolbar
              filterName={filterName}
              onFilterName={handleFilterName}
              headers={headers}
              getDownload={getDownload}
            />
          ) : null}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={shiprocketTableData?.length > 0 ? shiprocketTableData?.length : tableData?.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row, index) => (
                    <OrderTableRow
                      key={row?.id}
                      row={row}
                      index={index}
                      onDetails={() => handleDetailsViewRow(row?.orderId)}
                      downloadInvoice={() => downloadInvoice(row)}
                      handleOpen={() => handleOpen(row)}
                      handleOpenCancelModal={() => handleOpenCancelModal(row?.orderId, row?.orderDetails?.orderMode)}
                      handleCodPaymentModal={handleCodPaymentModal}
                      filterStatus={filterStatus}
                      handleExchangeOrderModal={handleExchangeOrderModal}
                      handleReturnOrderModal={handleReturnOrderModal}
                    />
                  ))}
                  {shiprocketTableData?.length > 0 ?
                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(page, rowsPerPage, shiprocketTableData?.length)}
                    />
                    :
                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(page, rowsPerPage, tableData?.length)}
                    />}

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered?.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Order Logs
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{ height: '550px', overflowY: 'scroll' }}>

            <OrderLogs orderData={orderData} />
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={openCancelModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Order Cancel Reason
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} >

            <OrderCancelReason handelCancelOrder={handelCancelOrder} orderId={orderId} orderMode={orderMode} handleClose={handleClose} />
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={openCodPaymentModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            COD Order
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} >

            <CodOrderDelivered orderId={orderId} handleClose={handleClose} />
            {/* <CodOrderDelivered  /> */}
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={openOrderExchangeModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} >
            <OrderExchange orderId={orderId} orderData={orderData} handleClose={handleClose} />
          </Typography>
        </Box>
      </Modal>


      <Modal
        open={openOrderReturnModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} >
            <OrderReturnModel orderId={orderId} orderData={orderData} handleClose={handleClose} />
          </Typography>
        </Box>
      </Modal>

    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, subTabsFilterStatus }) {
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return b[1] - a[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);
  if (subTabsFilterStatus) {
    inputData = inputData?.filter(
      (item) =>
        item?.orderDetails?.orderStatus?.toLowerCase().indexOf(subTabsFilterStatus?.toLowerCase()) !== -1
    );
  }
  if (filterName) {
    inputData = inputData?.filter(
      (item) =>
        item?.orderId.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1 ||
        item?.orderInvoiceNumber?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1 ||
        item?.customerDetails?.customerName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;


}