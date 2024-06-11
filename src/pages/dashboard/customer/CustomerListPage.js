import { Card, Container, Divider, Table, TableBody, TableContainer } from '@mui/material';
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
import { CustomerTableRow, CustomerTableToolbar } from 'sections/@dashboard/customer';
import { useDeleteCustomerById, useGetAllCustomers } from 'services/customerServices';
import BlankPage from '../BlankPage';

const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { id: 'image', label: '', align: 'left' },
  { id: 'name', label: 'NAME', align: 'left', width: 180 },
  { id: 'contact_no', label: 'CONTACT NO.', align: 'left' },
  { id: 'email_id', label: 'EMAIL ID', align: 'left' },
];

const headers = [
  { label: 'NAME', key: 'name' },
  { label: 'EMAIL ID', key: 'emailId' },
  { label: 'CONTACT NO', key: 'mobileNumber' },
];

export default function CustomerListPage() {
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

  const { data, isLoading: customersIsLoading, isError: customersError } = useGetAllCustomers();
  const { DeleteCustomer } = useDeleteCustomerById();
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

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.customer.edit(id));
  };
  const handleDeleteRow = (id) => {
    DeleteCustomer(id);
    const filterData = tableData.filter((item) => item._id !== id);
    setTableData(filterData);
  };

  if (customersIsLoading) return <LoadingScreen />;

  if (customersError === true) return <BlankPage />;

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDetailRow = (id) => {
    navigate(PATH_DASHBOARD.customer.view(id));
  };
  const handleAddAmcRow = (id) => {
    navigate(PATH_DASHBOARD.customer.addproductamc(id));
  };
  return (
    <>
      <Helmet>
        <title> Customer </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Customer List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Customer', href: PATH_DASHBOARD.customer.root },
            { name: 'Customer List' },
          ]}
        />

        <Card>
          <CustomerTableToolbar
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
                      <CustomerTableRow
                        key={row.id}
                        row={row}
                        index={index}
                        onDetails={() => handleDetailRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onAddAmcRow={() => handleAddAmcRow(row._id)}
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
        // item?.email_id?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1 ||
        item?.mobileNumber?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1
    );
  }
  return inputData;
}
