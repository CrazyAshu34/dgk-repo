import { Button, Card, Container, Divider, Table, TableBody, TableContainer } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import Iconify from 'components/iconify';
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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { DiscountTableRow, DiscountTableToolbar } from 'sections/@dashboard/discount';
import { useGetAllDiscounts } from 'services/discountServices';
import BlankPage from '../BlankPage';

const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { id: 'name', label: 'COUPON NAME', align: 'left' },
  { id: 'code', label: 'COUPON CODE', align: 'left' },
  { id: 'type', label: 'COUPON TYPE', align: 'left' },
  { id: 'category', label: 'COUPON CATEGORY', align: 'left' },
  { id: 'amount', label: 'AMOUNT', align: 'left' },
  { id: 'minAmount', label: 'MIN AMOUNT', align: 'left' },
  { id: 'status', label: 'STATUS', align: 'left' },
  { id: '' },
];

const headers = [
  { label: 'NAME', key: 'name' },
  { label: 'COUPON CODE', key: 'code' },
  { label: 'COUPON TYPE', key: 'type' },
  { label: 'COUPON CATEGORY', key: 'category' },
  { label: 'AMOUNT', key: 'amount' },
  { label: 'MIN AMOUNT', key: 'minAmount' },
  { label: 'STATUS', key: 'status' },
];

export default function DiscountListPage() {
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

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [getDownload, setGetDownload] = useState([]);
  const [filterName, setFilterName] = useState('');

  const { data, isLoading: discountIsLoading, isError: discountIsError } = useGetAllDiscounts();

  useEffect(() => {
    if (data) {
      setTableData(data);
      setGetDownload(data);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && !!filterName;

  if (discountIsLoading) return <LoadingScreen />;

  if (discountIsError) return <BlankPage />;

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.discount.edit(id));
  };

  return (
    <>
      <Helmet>
        <title>Discount</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Discount"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Discount', href: PATH_DASHBOARD.discount.root },
            { name: 'Discount List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.discount.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Discount
            </Button>
          }
        />

        <Card>
          <DiscountTableToolbar
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
                      <DiscountTableRow
                        key={row.id}
                        row={row}
                        index={index}
                        onEditRow={() => handleEditRow(row._id)}
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
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (filterName) {
    inputData = inputData?.filter(
      (item) => item?.name?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1
    );
  }

  return inputData;
}
