import {
    Box,
    Card,
    Container,
    Divider,
    Tab,
    Table,
    TableBody,
    TableContainer,
    Tabs,
    Typography
} from '@mui/material';
import Modal from '@mui/material/Modal';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import Scrollbar from 'components/scrollbar';
import { useSettingsContext } from 'components/settings';
import {
    TableEmptyRows,
    TableHeadCustom,
    TableNoData,
    TablePaginationCustom,
    emptyRows,
    getComparator,
    useTable,
} from 'components/table';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { ProductReviewTableRow, ProductReviewToolbar } from 'sections/@dashboard/review';
import ProductReviewDetails from 'sections/@dashboard/review/ProductReviewDetail';
import { useGetAllProductReview, useUpdateProductEnquiryStatus } from 'services/productServices';
import Label from '../../../components/label';
import { onCloseModal, onOpenModal } from '../../../redux/slices/calendar';
import { useDispatch, useSelector } from '../../../redux/store';
import BlankPage from '../BlankPage';

const TABLE_HEAD = [
    { id: 'index', label: 'SNO', align: 'left' },
    { id: 'pimg', label: '', align: 'left' },
    { id: 'productName', label: 'PRODUCT NAME', align: 'left' },
    { id: 'images', label: 'View', align: 'left' },
    { id: 'orderId', label: 'ORDER ID', align: 'left' },

    { id: 'date', label: 'DATE', align: 'left' },
    { id: 'status', label: 'STATUS', align: 'left' },
];

const headers = [
    { key: 'index', label: 'SNO', align: 'left' },
    { key: 'products[0].title', label: 'PRODUCT NAME', align: 'left' },
    { key: 'images', label: 'IMAGES', align: 'left' },
    { key: 'orders[0].orderId', label: 'ORDER ID', align: 'left' },
    { key: 'date', label: 'DATE', align: 'left' },
    { key: 'status', label: 'STATUS', align: 'left' },
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
    p: 1,
};
export default function ProductReviewListPage() {
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
    const navigate = useNavigate();
    const { themeStretch } = useSettingsContext();
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([]);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState(null);
    const [getDownload, setGetDownload] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [onChangeData, setOnChangeData] = useState({});
    const { openModal } = useSelector((state) => state.calendar);

    const {
        data,
        isLoading: productReviewIsLoading,
        isError: productReviewIsError,
    } = useGetAllProductReview();

    const { updateProductEnquiryStatus } = useUpdateProductEnquiryStatus();

    useEffect(() => {
        if (data) {
            setTableData(data);
            setGetDownload(data);
        }
    }, [data]);

    useEffect(() => {
        const payload = {
            view_status: '1',
        };
        updateProductEnquiryStatus(payload);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order),
        filterName, filterStatus,
    });

    const denseHeight = dense ? 52 : 72;

    // const isNotFound = !dataFiltered.length && !!filterName;
    const isNotFound =
        (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterStatus);
    const getLengthByStatus = (status) => tableData.filter((item) => item?.status === status).length;
    const TABS = [
        { value: 'all', label: 'All Reviews', color: 'success', count: tableData.length },
        {
            value: 'Pending',
            label: 'Pending',
            color: 'info',
            count: getLengthByStatus('Pending'),
        },
        {
            value: 'Active',
            label: 'Active',
            color: 'success',
            count: getLengthByStatus('Active'),
        },
        {
            value: 'InActive',
            label: 'InActive',
            color: 'error',
            count: getLengthByStatus('InActive'),
        },
    ];

    const handleFilterStatus = (event, newValue) => {

        setFilterStatus(newValue);
    };

    if (productReviewIsLoading) return <LoadingScreen />;

    if (productReviewIsError) return <BlankPage />;

    const handleFilterName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleAddEvent = (value) => {
        setOnChangeData({
            message: value?.message || '',
        });
        dispatch(onOpenModal());
    };

    const handleCloseModal = () => {
        dispatch(onCloseModal());
    };
    const handleClose = () => {
        setOpenReviewModal(false);
    }
    const handleReviewModel = (dataval) => {
        setOpenReviewModal(true);
        setReviewData(dataval);
    }
    const handleDetailsViewRow = (id) => {
        navigate(PATH_DASHBOARD.order.invoice(id));
    };
    return (
        <>
            <Helmet>
                <title>Product Review</title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Product Review List"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Product Review', href: PATH_DASHBOARD.productreview.root },
                        { name: 'Product Review List' },
                    ]}
                />

                <Card>
                    <Tabs
                        value={filterStatus}
                        onChange={handleFilterStatus}
                        sx={{
                            px: 2,
                            bgcolor: 'background.neutral',
                        }}
                    >
                        {TABS.map((tab) => (
                            <Tab
                                key={tab.value}
                                value={tab.value}
                                label={tab.label}
                                icon={
                                    <Label color={tab.color} sx={{ mr: 1 }}>
                                        {tab.count}
                                    </Label>
                                }
                            />
                        ))}
                    </Tabs> <Divider />
                    <ProductReviewToolbar
                        filterName={filterName}
                        onFilterName={handleFilterName}
                        headers={headers}
                        getDownload={getDownload}
                    />

                    <Divider />
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={tableData.length}
                                    numSelected={selected.length}
                                    onSort={onSort}
                                />

                                <TableBody>
                                    {dataFiltered
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <ProductReviewTableRow
                                                key={row.id}
                                                row={row}
                                                index={index}
                                                onOpenReviewModel={() => handleReviewModel(row)}
                                                handleDetailsViewRow={() => handleDetailsViewRow(row?.orders[0]?.orderId)}
                                            />
                                        ))}

                                    <TableEmptyRows
                                        height={denseHeight}
                                        emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                                    />

                                    <TableNoData isNotFound={isNotFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>

                    <TablePaginationCustom
                        count={dataFiltered.length}
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
                open={openReviewModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} >
                        <ProductReviewDetails reviewData={reviewData} handleClose={handleClose} />
                        {/* <OrderExchange orderId={orderId} orderData={orderData} handleClose={handleClose} /> */}
                    </Typography>
                </Box>
            </Modal>
        </>
    );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);
    if (filterStatus !== 'all') {
        inputData = inputData?.filter((user) => user.status === filterStatus);
    }
    if (filterName) {
        inputData = inputData.filter(
            (item) =>
                item?.products[0]?.title?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1 ||
                item?.message?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1 ||
                item?.status?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1 ||
                item?.orders[0]?.orderId?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1
        );
    }
    return inputData;
}
