import {
    Button,
    Card,
    Container,
    DialogActions,
    Divider,
    Stack,
    Table,
    TableBody,
    TableContainer,
  } from '@mui/material';
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
  import PropTypes from 'prop-types';
  import { useEffect, useState } from 'react';
  import { useGetAllCustomers } from 'services/customerServices';

  import { useGetAllServiceStaff } from 'services/staffServices';

  import CustomerTableRow from '../CustomerTableRow';
  import CustomerTableToolbar from '../CustomerTableToolbar';
  
  const TABLE_HEAD = [
    { id: 'index', label: 'SNO', align: 'left' },
    { id: 'name', label: 'NAME', align: 'left' },
    { id: '', label: 'SELECT PRODUCT', align: 'left' },
    { id: 'Status', label: 'STATUS', align: 'left' },
    { id: 'contact_no', label: 'CONTACT NO.', align: 'left' },
    { id: 'email_id', label: 'EMAIL ID', align: 'left' },
    { id: 'city', label: 'CITY ', align: 'left' },
    { id: '', label: 'ADD', align: 'left' },
  ];
  
  DialogSalectCustomer.propTypes = {
    customerType: PropTypes.object,
    setcustomerType: PropTypes.string,
    onCancel: PropTypes.func,
  };
  
  export default function DialogSalectCustomer({ onCancel, customerType, setcustomerType }) {
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
  
    const [tableData, setTableData] = useState([{}]);
    const [filterName, setFilterName] = useState('');
  
    const { data, isLoading: customersIsLoading, isError: customersError } = useGetAllCustomers();
    const {
    data: allstaff,
    isLoading: staffIsLoading,
    isError: staffIsError,
  } = useGetAllServiceStaff();
    useEffect(() => {
      if (data?.length) {
        
        setTableData(data);
      }
    }, [data]);
   console.log(tableData,"allstaff==",allstaff);
    const dataFiltered = applyFilter({
      inputData: tableData,
      comparator: getComparator(order, orderBy),
      filterName,
    });
  
    const denseHeight = dense ? 52 : 72;
  
    const isNotFound = !dataFiltered.length && !!filterName;
  
    if (customersIsLoading) return <div />;
  
    if (customersError === true) return <div />;
  
    const handleFilterName = (event) => {
      setPage(0);
      setFilterName(event.target.value);
    };
  
    const onSubmit = (ids) => {
      const array = tableData.find((x) => x._id === ids);
      setcustomerType([array]);
    };

    return ( 
      <>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Card>
            <CustomerTableToolbar filterName={filterName} onFilterName={handleFilterName} />
  
            <Divider />
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData?.length} />
  
                  <TableBody>
                    {dataFiltered
                      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <CustomerTableRow
                          key={index}
                          row={row}
                          index={index}
                          onSubmit={() => onSubmit(row?._id)}
                          onCancel={onCancel}
                        />
                      ))}
  
                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(page, rowsPerPage, tableData?.length)}
                    />
  
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
              dense={dense}
              onChangeDense={onChangeDense}
            />
          </Card>
        </Container>
  
        <Stack direction="row" sx={{ mt: 3 }} justifyContent="end">
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={onCancel}>
              Cancel
            </Button>
          </DialogActions>
        </Stack>
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
          item?.contact_no.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
          item?.email_id.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
      );
    }
    return inputData;
  }
  