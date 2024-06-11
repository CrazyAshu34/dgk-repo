import { Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
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
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
// import { CustomerTableRow, CustomerTableToolbar } from 'sections/@dashboard/recyclebin';
import { 
    useEmptyAllDataCustomers,
    useGetAllDeleteCustomersRecyclebin,
    usePermanentlyDeleteCustomersById,
    useReStoreAllDataCustomers,
    useReStoreDataCustomersById,
  } from 'services/customerServices';
import CustomerTableRow from '../../../sections/@dashboard/recyclebin/CustomerTableRow';
import CustomerTableToolbar from '../../../sections/@dashboard/recyclebin/CustomerTableToolbar';
import BlankPage from '../BlankPage';

const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { id: 'cid', label: 'CID', align: 'left' },
  { id: 'name', label: 'CUSTOMER NAME', align: 'left' },
  { id: 'contact_no', label: 'CONTACT', align: 'left' },
  { id: 'email_id', label: 'EMAIL', align: 'left' },
  { id: 'city', label: 'CITY ', align: 'left' },
  { id: '', label: 'ACTION', align: 'left' },
];

export default function NewsListPage() {
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

  const [filterName, setFilterName] = useState('');

  const {
    data,
    isLoading: customersIsLoading,
    isError: customersError,
  } = useGetAllDeleteCustomersRecyclebin();
  const { ReStoreData } = useReStoreDataCustomersById();
  const { ReStoreAllData } = useReStoreAllDataCustomers();
  const { PermanentlyDeleteCustomers } = usePermanentlyDeleteCustomersById();
  const { EmptyAllData } = useEmptyAllDataCustomers();

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

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

  if (customersIsLoading) return <LoadingScreen />;

  if (customersError === true) return <BlankPage />;

  const handleReStoreRow = (id) => {
    ReStoreData(id);
    const filterData = tableData.filter((item) => item._id !== id);
    setTableData(filterData);
  };

  const handleDeletePermanentlyRow = (id) => {
    PermanentlyDeleteCustomers(id);
    const filterData = tableData.filter((item) => item._id !== id);
    setTableData(filterData);
  };

  const handleAllReStoreRow = () => {
    ReStoreAllData();
  };

  const handleEmptyAllData = () => {
    EmptyAllData();
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
          {tableData.length ? (
            <CustomerTableToolbar
              filterName={filterName}
              onFilterName={handleFilterName}
              handleAllReStoreRow={() => handleAllReStoreRow()}
              handleEmptyAllData={() => handleEmptyAllData()}
            />
          ) : null}
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
                        onDeletePermanentlyRow={() => handleDeletePermanentlyRow(row._id)}
                        onReStoreRow={() => handleReStoreRow(row._id)}
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
        item?.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.cid.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.email_id.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.contact_no.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
