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
import { GstTableRow, GstTableToolbar } from 'sections/@dashboard/gst';
import { useGetAllGst } from 'services/gstServices';
import BlankPage from '../BlankPage';



const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { id: 'gst_name', label: 'GST NAME', align: 'left' },
  { id: 'sgst', label: 'SGST', align: 'left' },
  { id: 'cgst', label: 'CGST', align: 'left' },
  { id: 'total_gst', label: 'TOTAL GST', align: 'left' },
  { id: '' },
];

const headers = [
  { label: 'NAME', key: 'discount_name' },
  { label: 'DISCOUNT CODE', key: 'discount_code' },
  { label: 'DISCOUNT TYPE', key: 'discount_type' },
  { label: 'DISCOUNT', key: 'discount' },
];

export default function GstListPage() {
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

  const { data, isLoading: gstIsLoading, isError: gstIsError } = useGetAllGst();

  useEffect(() => {
    if (data) {
      setTableData(data);
      setGetDownload(data);
    }
  }, [data]);
  console.log("gstdata==", data);
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && !!filterName;

  if (gstIsLoading) return <LoadingScreen />;

  if (gstIsError) return <BlankPage />;

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.gst.edit(id));
  };

  return (
    <>
      <Helmet>
        <title>GST</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="GST"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'GST', href: PATH_DASHBOARD.gst.root },
            { name: 'GST List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.gst.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New GST
            </Button>
          }
        />

        <Card>
          <GstTableToolbar
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
                      <GstTableRow
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
      (item) => item.name?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1
    );
  }

  return inputData;
}
