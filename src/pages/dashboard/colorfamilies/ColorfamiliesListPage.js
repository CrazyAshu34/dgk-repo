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
import { ColorFamiliesTableToolbar } from 'sections/@dashboard/colorfamilies';
import ColorFamiliesTableRow from 'sections/@dashboard/colorfamilies/ColorFamiliesTableRow';
import { useGetAllColorFamilies } from 'services/colorfamiliesServices';
import BlankPage from '../BlankPage';

const TABLE_HEAD = [
    { id: 'index', label: 'SNO', align: 'left' },
    { id: 'colorName', label: 'COLOR NAME', align: 'left' },
    { id: 'hexaCode', label: 'HEXA COLOR CODE', align: 'left' },
    { id: '' },
];

const headers = [
    { label: 'COLOR NAME', key: 'colorName' },
    { label: 'HEXA COLOR CODE', key: 'hexaCode' },
];

export default function ColorfamiliesListPage() {
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

    const { data, isLoading: colorIsLoading, isError: colorIsError } = useGetAllColorFamilies();

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

    if (colorIsLoading) return <LoadingScreen />;

    if (colorIsError) return <BlankPage />;

    const handleFilterName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleEditRow = (id) => {
        navigate(PATH_DASHBOARD.colorfamilies.edit(id));
    };

    return (
        <>
            <Helmet>
                <title>Color Families</title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Color Families"
                    links={[
                        { name: 'Color Families', href: PATH_DASHBOARD.root },
                        { name: 'Color Families', href: PATH_DASHBOARD.colorfamilies.root },
                        { name: 'Color Families List' },
                    ]}
                    action={
                        <Button
                            component={RouterLink}
                            to={PATH_DASHBOARD.colorfamilies.new}
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                            New Color Family
                        </Button>
                    }
                />

                <Card>
                    <ColorFamiliesTableToolbar

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
                                            <ColorFamiliesTableRow
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
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (filterName) {
        inputData = inputData.filter(
            (item) => item.colorName?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1
        );
    }

    return inputData;
}
