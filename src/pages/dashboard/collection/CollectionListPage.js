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
import { CollectionTableRow, CollectionTableToolbar } from 'sections/@dashboard/collection';
import { useDeleteCollectionById, useGetAllCollection } from 'services/collectionServices';
import BlankPage from '../BlankPage';

const TABLE_HEAD = [
    { id: 'index', label: 'SNO', align: 'left' },
    { id: 'icon', label: 'ICON', align: 'left' },
    { id: 'name', label: 'COLLECTION', align: 'left' },
    { id: '' },
];

const headers = [
    { label: 'ICON', key: 'icon' },
    { label: 'COLLECTION', key: 'name' },
];

export default function CollectionListPage() {
    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        //
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

    const { data, isLoading: categoryIsLoading, isError: categoryIsError } = useGetAllCollection();
    const { DeleteCollection } = useDeleteCollectionById();

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

    if (categoryIsLoading) return <LoadingScreen />;

    if (categoryIsError) return <BlankPage />;

    const handleFilterName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleEditRow = (id) => {
        navigate(PATH_DASHBOARD.collection.edit(id));
    };

    const handleDeleteRow = (id) => {
        DeleteCollection(id);
        const filterData = tableData.filter((item) => item._id !== id);
        setTableData(filterData);
    };

    return (
        <>
            <Helmet>
                <title>Collection</title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Collection List"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Collection', href: PATH_DASHBOARD.collection.root },
                        { name: 'Collection List' },
                    ]}
                    action={
                        <Button
                            component={RouterLink}
                            to={PATH_DASHBOARD.collection.new}
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                            New Collection
                        </Button>
                    }
                />

                <Card>
                    <CollectionTableToolbar
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
                                            <CollectionTableRow
                                                key={row.id}
                                                row={row}
                                                index={index}
                                                onDeleteRow={() => handleDeleteRow(row._id)}
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
            (item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        );
    }

    return inputData;
}
