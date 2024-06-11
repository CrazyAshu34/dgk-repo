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
import { StaffTableRow, StaffTableToolbar } from 'sections/@dashboard/staff';
import { useDeleteStaffById, useGetAllStaff } from 'services/staffServices';
import BlankPage from '../BlankPage';

const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { id: 'cus_image', label: 'PICTURE', align: 'left' },
  { id: 'cus_name', label: 'NAME', align: 'left' },
  { id: 'cus_designation', label: 'DESIGNATION', align: 'left' },
  { id: 'primary_contact', label: 'CONTACT NO', align: 'left' },
  { id: 'cus_email', label: 'EMAIL ID', align: 'left' },
  { id: 'cus_status', label: 'STATUS', align: 'left' },
  { id: '' },
];

const headers = [
  { label: 'PICTURE', key: 'profile' },
  { label: 'NAME', key: 'name' },
  { label: 'DESIGNATION', key: 'designationName' },
  { label: 'CONTACT NO', key: 'contactNo' },
  { label: 'EMAIL ID', key: 'emailId' },
  { label: 'STATUS', key: 'status' },
];

export default function StaffListPage() {
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

  const { data, isLoading: staffIsLoading, isError: staffIsError } = useGetAllStaff();
  const { DeleteStaff } = useDeleteStaffById();
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

  if (staffIsLoading) return <LoadingScreen />;

  if (staffIsError === true) return <BlankPage />;

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.staff.edit(id));
  };

  const handleChangePasswordRow = (id) => {
    navigate(PATH_DASHBOARD.staff.passwordchange(id));
  };

  const handleDetailsViewRow = (id) => {
    navigate(PATH_DASHBOARD.staff.view(id));
  };
  const handleDeleteRow = (id) => {
    DeleteStaff(id);
    const filterData = tableData.filter((item) => item._id !== id);
    setTableData(filterData);
  };
  return (
    <>
      <Helmet>
        <title> Staff </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Staff List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Staff', href: PATH_DASHBOARD.staff.root },
            { name: 'Staff List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.staff.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New staff
            </Button>
          }
        />

        <Card>
          <StaffTableToolbar
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
                      <StaffTableRow
                        key={row.id}
                        row={row}
                        index={index}
                        onEditRow={() => handleEditRow(row._id)}
                        handleChangePassword={() => handleChangePasswordRow(row._id)}
                        handleDetailsView={() => handleDetailsViewRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
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
      (item) =>
        item?.name?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1 ||
        item?.contactNo?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1 ||
        item?.emailId?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1
    );
  }
  return inputData;
}
