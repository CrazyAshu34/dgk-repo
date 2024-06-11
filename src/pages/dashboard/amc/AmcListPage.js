import {
    Button,
    Card,
    Container,
    Dialog,
    DialogTitle,
    Divider,
    Tab,
    Table,
    TableBody,
    TableContainer,
    Tabs,
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import { Helmet } from 'react-helmet-async'; 
  import { useDispatch } from 'react-redux';
  import { Link as RouterLink, useNavigate } from 'react-router-dom';
  import CustomBreadcrumbs from 'components/custom-breadcrumbs';
  import Iconify from 'components/iconify';
  import LoadingScreen from 'components/loading-screen/LoadingScreen';
  import BlankPage from 'pages/dashboard/BlankPage';
  import { onCloseModal, onOpenModal } from 'redux/slices/calendar';
  import { useSelector } from 'redux/store';
  import { PATH_DASHBOARD } from 'routes/paths';
  import { AmcTableRow, AmcTableToolbar } from 'sections/@dashboard/amc';
  import { DialogExpired, ProductAmc } from 'sections/@dashboard/amc/tab';
  import { useDeleteAmcById, useGetAllAmc } from 'services/amcServices';
  import Label from '../../../components/label';
  import Scrollbar from '../../../components/scrollbar';
  import { useSettingsContext } from '../../../components/settings';
  import {
    emptyRows,
    getComparator,
    TableEmptyRows,
    TableHeadCustom,
    TableNoData,
    TablePaginationCustom,
    useTable,
  } from '../../../components/table';

  
  const TABLE_HEAD = [
    { id: 'index', label: 'SNO', align: 'left' },
    { id: 'customers[0].name', label: 'CUSTOMER', align: 'left', width: 800 },
    { id: 'contact_no', label: 'CONTACT', align: 'left' },
    { id: 'customers[0].city', label: 'CITY', align: 'left' },
    { id: 'amc_id', label: 'AMC ID', align: 'left' },
    { id: 'amc_type', label: 'AMC TYPE', align: 'left' },
    { id: 'amc_status', label: 'AMC', align: 'left' },
    { id: 'status', label: 'EXPIRY ', align: 'left' },
    // { id: '', label: 'UPGRADE ', align: 'left' },
    // { id: 'details', label: 'DETAILS', align: 'left', width: 1000 },
    { id: '', label: 'A.Manager ', align: 'left' },
    { id: '', label: 'Action', align: 'left' },
  ];
  
  const headers = [
    { label: 'CUSTOMER NAME', key: 'customers[0].name' },
    { label: 'CONTACT', key: 'customers[0].contact_no' },
    { label: 'CITY', key: 'customers[0].city' },
    { label: 'AMC ID', key: 'amc_id' },
    { label: 'PRODUCT NAME ', key: 'products[0].title' },
    { label: 'AMC STATUS', key: 'status' },
    { label: 'EXPIRY DATE', key: 'expiry_date' },
  ];
  
  export default function AmcListPage() {
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
    const navigate = useNavigate();
    const { openModal } = useSelector((state) => state.calendar);
    const { data, isLoading: amcIsLoading, isError: amcIsError } = useGetAllAmc();
    const { DeleteAmc } = useDeleteAmcById();
  
    const [tableData, setTableData] = useState([]);
    const [rowId, setRowId] = useState('');
    const [onChangeData, setOnChangeData] = useState({});
    const [filterName, setFilterName] = useState('');
    const [getDownload, setGetDownload] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');

    const [productModel, setProductModel] = useState(false);
  
    useEffect(() => {
      if (data?.length > 0) {
        setTableData(data);
        setGetDownload(data);
      }
    }, [data]);
  
    const dataFiltered = applyFilter({
      inputData: tableData,
      comparator: getComparator(order, orderBy),
      filterName,
      filterStatus,
    });
  
    const denseHeight = dense ? 52 : 72;
  
    const isNotFound =
      (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterStatus);
  
    const getLengthByStatus = (status) => tableData.filter((item) => item?.status === status).length;
    function getExpLengthByStatus(){
      const todate = new Date();
      const inputDate = new Date(todate);
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const convertedDate = inputDate.toLocaleDateString('en-GB', options);
      const parts = convertedDate.split('/');
      const finalDate = parts.reverse().join('-');
      const currentDate = new Date();
      const next30Days = [];
      const lastDate = new Date();
      lastDate.setDate(currentDate.getDate() + 30);
      next30Days.push(lastDate.toISOString().split('T')[0]);
      const startDate = new Date(finalDate);
      const endDate = new Date(next30Days[0]);
      const inputfData = tableData.filter(item => {
      const itemDate = new Date(item.expiry_date);
        return itemDate >= startDate && itemDate <= endDate;
      });
      return inputfData.length;
    }
    const TABS = [
      { value: 'all', label: 'All AMCS', color: 'info', count: tableData.length },
      {
        value: 'Active AMC',
        label: 'Active AMC',
        color: 'info',
        count: getLengthByStatus('Active AMC'),
      },
      {
        value: 'expiry30',
        label: 'AMC Expiry in 30 Days',
        color: 'info',
        count: getExpLengthByStatus('expiry30'),
      },
      {
        value: 'InActive AMC',
        label: 'InActive AMC',
        color: 'default',
        count: getLengthByStatus('InActive AMC'),
      },
    ];
  
    const handleFilterStatus = (event, newValue) => {
      setPage(0);
      setFilterStatus(newValue);
    };
  
    const handleFilterName = (event) => {
      setPage(0);
      setFilterName(event.target.value);
    };
  
    const handleEditRow = (id) => {
      navigate(PATH_DASHBOARD.amc.edit(id));
    };
  
    const handleDeleteRow = (id) => {
      DeleteAmc(id);
      const filterData = tableData.filter((item) => item._id !== id);
      setTableData(filterData);
    };
  
    if (amcIsLoading) return <LoadingScreen />;
  
    if (amcIsError) return <BlankPage />;
  
    const handleAddEvent = (row) => {
      setOnChangeData({
        expiry_date: row?.expiry_date || '',
        _id: row?._id || '',
      });
      dispatch(onOpenModal());
    };
  
    const handleCloseModal = () => { 
      dispatch(onCloseModal());
    };
    const handleClosePModal = () => {
        setProductModel(false);
    }
    const handleOpenPModal = (id) => {
        setRowId(id)
        setProductModel(true);
    }
    const handleViewRow = (id) => {
      navigate(PATH_DASHBOARD.amc.view(id));
    };
    return (
      <>
        <Helmet>
          <title>AMC Management</title>
        </Helmet>
  
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="AMC Management List"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'AMC Management', href: PATH_DASHBOARD.amc.root },
              { name: 'AMC Management List' },
            ]}
            action={
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.amc.new}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Product AMC
              </Button>
            }
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
            </Tabs>
  
            <Divider />
            {tableData.length ? (
              <AmcTableToolbar
                filterName={filterName}
                onFilterName={handleFilterName}
                headers={headers}
                getDownload={getDownload}
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
                        <AmcTableRow
                          key={row?.id}
                          row={row}
                          index={index}
                          onDeleteRow={() => handleDeleteRow(row._id)}
                          onEditRow={() => handleEditRow(row._id)}
                          onViewRow={() => handleViewRow(row._id)}
                          handleAddEvent={() => handleAddEvent(row)}
                          handleOpenPModal={() => handleOpenPModal(row._id)}
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
  
        <Dialog fullWidth maxWidth="xs" open={openModal} onClose={handleCloseModal}>
          <DialogTitle>UPGRADE</DialogTitle>
          <DialogExpired
            date={onChangeData?.expiry_date}
            _id={onChangeData?._id}
            onCancel={handleCloseModal}
          />
        </Dialog>

        <Dialog fullWidth maxWidth="md"  open={productModel} onClose={handleClosePModal}>
        
          <ProductAmc 
            id={rowId}
          //  onCancel={handleCloseModal}
          />
        </Dialog>
      </>
    );
  }
  
  // ----------------------------------------------------------------------
  // function convert(str) {
  //   var date = new Date(str),
  //     mnth = ("0" + (date.getMonth() + 1)).slice(-2),
  //     day = ("0" + date.getDate()).slice(-2);
  //   return [date.getFullYear(), mnth, day].join("-");
  // }
  function applyFilter({ inputData, comparator, filterName, filterStatus }) {
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
          item?.customers[0]?.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
          item?.products[0]?.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
      );
    }
  
    if (filterStatus !== 'all' && filterStatus !== 'expiry30') {
      inputData = inputData.filter((user) => user.status === filterStatus);
    } else if(filterStatus==='expiry30'){
      const todate = new Date();
      const inputDate = new Date(todate);
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const convertedDate = inputDate.toLocaleDateString('en-GB', options);
      const parts = convertedDate.split('/');
      const finalDate = parts.reverse().join('-');
      const currentDate = new Date();
      const next30Days = [];
      const lastDate = new Date();
      lastDate.setDate(currentDate.getDate() + 30);
      next30Days.push(lastDate.toISOString().split('T')[0]);
      console.log("inputData==",inputData);
      const startDate = new Date(finalDate);
      const endDate = new Date(next30Days[0]);
       inputData = inputData.filter(item => {
        const itemDate = new Date(item.expiry_date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }


    return inputData;
  }
  