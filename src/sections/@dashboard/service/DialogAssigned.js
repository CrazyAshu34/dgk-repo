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
  import { useGetAllStaffData, useGetAllOnlineServiceStaff } from 'services/staffServices';
  import AssignedTableRow from './AssignedTableRow';
  import AssignedTableToolbar from './AssignedTableToolbar';
  
  const TABLE_HEAD = [
    { id: 'index', label: 'SNO', align: 'left' },
    { id: 'profile', label: 'PICTURE', align: 'left' },
    { id: 'name', label: 'NAME', align: 'left' },
    { id: 'designation_id', label: 'DESIGNATION', align: 'left' },
    { id: 'contact_no', label: 'PHONE NO', align: 'left' },
    { id: '', label: 'ADD', align: 'left' },
  ];
  
  DialogAssigned.propTypes = {
    id: PropTypes.object,
    statusPage: PropTypes.string,
    onCancel: PropTypes.func,
    setStatusfor: PropTypes.string,
    setAssignee: PropTypes.func,
    onAssignStaff: PropTypes.func,
    pageName: PropTypes.string,
  }; 
  
  export default function DialogAssigned({ statusPage, id, onCancel, setStatusfor, setAssignee, onAssignStaff, pageName }) {
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
  
    const [tableData, setTableData] = useState([]);
    const [filterName, setFilterName] = useState('');
  
    const {
      data: allstaff,
      isLoading: staffIsLoading,
      isError: staffIsError,
    } = useGetAllStaffData();
    const {
      data: allOnlineSericeManagerData,
      isLoading: onlineSericeManagerIsLoading,
      isError: onlineSericeManagerIsError,
    } = useGetAllOnlineServiceStaff();
    
  
    useEffect(() => {
      if (allstaff || allOnlineSericeManagerData) {
        // const mobilestaff = allstaff.filter((item) => item?.designation_id === 'SERVICE PERSON');
        if(pageName==="customer"){
        setTableData(allOnlineSericeManagerData);}else{
          setTableData(allstaff);
        }
      }
    }, [allstaff, allOnlineSericeManagerData, pageName]);
  
    const dataFiltered = applyFilter({
      inputData: tableData,
      comparator: getComparator(order, orderBy),
      filterName,
    });
  
    const denseHeight = dense ? 52 : 72;
  
    const isNotFound = !dataFiltered.length && !!filterName;
  
    if (staffIsLoading) return <div />;
  
    if (staffIsError === true) return <div />;
  
    const handleFilterName = (event) => {
      setPage(0);
      setFilterName(event.target.value);
    };
    const onSubmitassignee = (ids) => {
        const array = tableData.find((x) => x._id === ids);
        setAssignee([array]);
      };
    return (
      <>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Card>
            <AssignedTableToolbar filterName={filterName} onFilterName={handleFilterName} />
  
            <Divider />
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData.length} />
  
                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <AssignedTableRow
                          key={index}
                          row={row}
                          index={index}
                          onSubmit={() => onSubmitassignee(row?._id)}
                          onAssignStaff={() => onAssignStaff(row?._id)}
                          onCancel={onCancel}
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
    const stabilizedThis = inputData?.map((el, index) => [el, index]);
  if(stabilizedThis){
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
  
    inputData = stabilizedThis?.map((el) => el[0]);
  }
    if (filterName) {
      inputData = inputData?.filter(
        (item) =>
          item?.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
          item?.contact_no.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
          item?.designation_id.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
      );
    }
    return inputData;
  }
  