import * as React from 'react';
import { Button, Card, Container, Divider, Table, TableBody, TableContainer, Box, Tab, Tabs } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import Iconify from 'components/iconify';
import { Icon } from '@iconify/react';
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
import { ServiceTableRow, ServiceTableToolbar } from 'sections/@dashboard/service';
import { useDeleteServiceById, useGetAllService, useUpdateViewStatus } from 'services/serviceServices';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Label from '../../../components/label';
import BlankPage from '../BlankPage';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { id: 'service_id', label: 'SERVICE ID', align: 'center' },
  { id: 'cus_name', label: 'CUSTOMER NAME', align: 'left' },
  { id: 'city', label: 'CITY', align: 'center' },
  { id: 'assign_to', label: 'ASSIGN TO', align: 'center' },
  { id: 'priority', label: 'PRIORITY', align: 'center' },
  { id: 'status', label: 'STATUS ', align: 'center' },
  { id: 'otp', label: 'OTP ', align: 'center' },
  { id: 'rating', label: 'Rating ', align: 'center' },
  { id: 'source', label: 'SOURCE', align: 'center' },
  { id: 'create_date', label: 'DATE', align: 'center', width:'200px' },
  { id: '' },
];

const headers = [
  { label: 'SERVICE ID', key: 'service_id' },
  { label: 'CUSTOMER NAME', key: 'customers[0].name' },
  { label: 'AMC STATUS', key: 'status' },
  { label: 'CITY', key: 'customers[0].city' },
 
  { label: 'RATING', key: 'rating' },
  { label: 'SOURCE', key: 'source' },
  { label: 'DATE', key: 'create_date' },
];
// const AnyReactComponent = ({ text }) => <div>{text}</div>;
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
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');
  const [getDownload, setGetDownload] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [open, setOpen] = React.useState(false);
  const { data, isLoading: ServiceIsLoading, isError: ServiceIsError } = useGetAllService();
  const { DeleteService } = useDeleteServiceById();
  const { updateViewstatus } = useUpdateViewStatus();
  const handleOpen = (id) => {

    setOpen(true);

  }
  const handleClose = () => setOpen(false);
  useEffect(() => {
    if (data) {
      setTableData(data);
      setGetDownload(data);
    }
    updateViewstatus();
  }, [data, updateViewstatus]);

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

  const TABS = [
    { value: 'all', label: 'All', color: 'info', count: tableData.length },
    {
      value: 'New',
      label: 'New',
      color: 'default',
      count: getLengthByStatus('New'),
    },
    {
      value: 'Assigned',
      label: 'Assigned',
      color: 'error',
      count: getLengthByStatus('Assigned'),
    },
    {
      value: 'On The Way',
      label: 'On The Way',
      color: 'info',
      count: getLengthByStatus('On The Way'),
    },
    {
      value: 'On Progress',
      label: 'On Progress',
      color: 'warning',
      count: getLengthByStatus('On Progress'),
    },
    {
      value: 'Completed',
      label: 'Completed',
      color: 'success',
      count: getLengthByStatus('Completed'),
    },

    {
        value: 'Hold On Our Side',
        label: 'Hold On Our Side',
        color: 'default',
        count: getLengthByStatus('Hold On Our Side'),
    },

    {
        value: 'Hold On Client Side',
        label: 'Hold On Client Side',
        color: 'default',
        count: getLengthByStatus('Hold On Client Side'),
    },
    {
        value: 'Canceled',
        label: 'Canceled',
        color: 'error',
        count: getLengthByStatus('Canceled'),
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
    navigate(PATH_DASHBOARD.service.edit(id));
  };

  const handleDeleteRow = (id) => {
    DeleteService(id);
    const filterData = tableData.filter((item) => item._id !== id);
    setTableData(filterData);
  };

  const handleDetailRow = (id) => {
    navigate(PATH_DASHBOARD.service.view(id));
  };
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };
//   const Marker = ({ name }) => {
//     return <div className="SuperAwesomePin"><Icon icon="cil:location-pin" style={{ fontSize: 30, color: "red" }} /></div>
// };
  if (ServiceIsLoading) return <LoadingScreen />;

  if (ServiceIsError === true) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title> Service Management </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Service Management List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Service Management', href: PATH_DASHBOARD.service.root },
            { name: 'Service List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.service.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Service
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
            <ServiceTableToolbar
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
                      <ServiceTableRow
                        key={row.id}
                        row={row}
                        index={index}
                        onEditRow={() => handleEditRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onDetails={() => handleDetailRow(row._id)}
                        onhandleOpen={() => handleOpen()}
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Current location
          </Typography>
          <Typography id="modal-modal-description"  >
            {/* <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCr8EfZOIDu61dCIDQQATtldtDYjmJ5l58" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={21.3032}
          lng={30.337844}
          text="My Marker"
        />
      </GoogleMapReact> */}location
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

// ----------------------------------------------------------------------

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
        item?.service_id.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.customers[0]?.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.customers[0]?.city.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  return inputData;
}
