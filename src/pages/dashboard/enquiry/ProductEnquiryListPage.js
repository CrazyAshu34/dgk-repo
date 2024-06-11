import {
  Card,
  Container,
  Dialog,
  DialogTitle,
  Divider,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
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
import { PATH_DASHBOARD } from 'routes/paths';
import {
  DialogProductEnquries,
  ProductEnquriesTableRow,
  ProductEnquriesToolbar,
} from 'sections/@dashboard/enquries';
import { useGetAllProductEnquiry, useUpdateProductEnquiryStatus } from 'services/productServices';
import { onCloseModal, onOpenModal } from '../../../redux/slices/calendar';
import { useDispatch, useSelector } from '../../../redux/store';
import BlankPage from '../BlankPage';

const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { id: '', label: 'IMAGE', align: 'left' },
  { id: 'productName', label: 'PRODUCT NAME', align: 'left' },
  { id: '', label: 'VARIANT', align: 'left' },
  { id: 'name', label: 'NAME', align: 'left' },
  { id: 'contactNo', label: 'PHONE NO', align: 'left' },
  { id: 'emailId', label: 'EMAIL ID ', align: 'left' },
  { id: 'date', label: 'DATE', align: 'left' },
  { id: '' },
];

const headers = [
  { label: 'PRODUCT', key: 'products[0].title' },
  { label: 'VARIANT', key: 'variant[0].title, variant[0].value' },
  { label: 'NAME', key: 'name' },
  { label: 'PHONE NO', key: 'contactNo' },
  { label: 'EMAIL ID', key: 'emailId' },
  { label: 'MESSAGE', key: 'message' },
  { label: 'DATE', key: 'createdAt' },
];

export default function ProductEnquiryListPage() {
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

  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [getDownload, setGetDownload] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [onChangeData, setOnChangeData] = useState({});
  const { openModal } = useSelector((state) => state.calendar);

  const {
    data,
    isLoading: productEnquiryIsLoading,
    isError: productEnquiryIsError,
  } = useGetAllProductEnquiry();

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
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && !!filterName;

  if (productEnquiryIsLoading) return <LoadingScreen />;

  if (productEnquiryIsError) return <BlankPage />;

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

  return (
    <>
      <Helmet>
        <title>Product Enquries</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Product Enquries List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Product Enquries', href: PATH_DASHBOARD.contact.root },
            { name: 'Product Enquries List' },
          ]}
        />

        <Card>
          <ProductEnquriesToolbar
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
                      <ProductEnquriesTableRow
                        key={row.id}
                        row={row}
                        index={index}
                        onOpenDialog={() => handleAddEvent(row)}
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

      <Dialog fullWidth maxWidth="sm" open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Details</DialogTitle>
        <DialogProductEnquries message={onChangeData?.message} onCancel={handleCloseModal} />
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (item) =>
        item?.name?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1 ||
        item?.contactNo?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1 ||
        item?.emailId?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1
    );
  }
  return inputData;
}
