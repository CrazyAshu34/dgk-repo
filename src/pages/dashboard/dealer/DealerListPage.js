import { Button, Card, Container, Divider, Table, TableBody, TableContainer } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import Iconify from 'components/iconify';
import LoadingScreen from 'components/loading-screen';
import Scrollbar from 'components/scrollbar';
import { useSettingsContext } from 'components/settings';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'components/table';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { DealerTableRow, DealerTableToolbar } from 'sections/@dashboard/dealer';
import {
  useDeleteDealerById,
  useGetAllDealer,
  useUpdateDealerStatusNewById,
} from 'services/dealerServices';
import BlankPage from '../BlankPage';

const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { id: 'ret_id', label: 'ID', align: 'left' },
  { id: 'dist_com_name', label: 'FIRM NAME', align: 'left' },
  { id: 'dist_name', label: 'NAME', align: 'left', width: 180 },
  { id: 'city', label: 'CITY ', align: 'left' },
  { id: 'dist_contact', label: 'CONTACT NO.', align: 'left' },
  { id: 'dist_email', label: 'EMAIL', align: 'left' },
  { id: '', label: 'STATUS', align: 'left' },
  { id: '' },
];

const headers = [
  { label: 'ID', key: 'ret_id' },
  { label: 'FIRM NAME', key: 'dist_com_name' },
  { label: 'NAME', key: 'dist_name' },
  { label: 'CITY', key: 'city' },
  { label: 'EMAIL ID', key: 'dist_email' },
  { label: 'CONTACT NO', key: 'dist_contact' },
];

export default function DealerListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    //
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

  const { data, isLoading, isError } = useGetAllDealer();
  const { DeleteDealer } = useDeleteDealerById();
  const { updateDealerStatusNew } = useUpdateDealerStatusNewById();

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
    updateDealerStatusNew(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && !!filterName;

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDetailRow = (id) => {
    navigate(PATH_DASHBOARD.dealer.view(id));
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.dealer.edit(id));
  };

  const handleDeleteRow = (id) => {
    DeleteDealer(id);
    const filterData = tableData.filter((item) => item._id !== id);
    setTableData(filterData);
  };
  const handleChangePasswordRow = (id) => {
    navigate(PATH_DASHBOARD.dealer.passwordchange(id));
  };
  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title> Dealer Management </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Dealer Management List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Dealer Management', href: PATH_DASHBOARD.dealer.root },
            { name: 'Dealer Management List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.dealer.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Dealer
            </Button>
          }
        />

        <Card>
          <DealerTableToolbar
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
                      <DealerTableRow
                        key={row.id}
                        row={row}
                        index={index}
                        onDetails={() => handleDetailRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        handleChangePassword={() => handleChangePasswordRow(row._id)}
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
        item?.dist_com_name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.dist_name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.city.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.dist_contact.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
