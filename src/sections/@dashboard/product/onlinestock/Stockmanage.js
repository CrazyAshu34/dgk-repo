/* eslint-disable array-callback-return */
/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
/* eslint-disable arrow-body-style */
import { DataGrid, GridCellEditStopReasons, GridCellModes, GridToolbar } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Box, Button } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';

StockManageTable.propTypes = {
    name: PropTypes.string.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object),
    columns: PropTypes.arrayOf(PropTypes.object),
};

function StockManageTable({ name, rows, columns }) {
    const { control, setValue, watch, resetField } = useFormContext();
    const [showHeader, setShowHeader] = useState(false);

    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    const [cellModesModel, setCellModesModel] = useState({});

    const handleCellModesModelChange = React.useCallback((newModel) => {
        setCellModesModel(newModel);
    }, []);

    const values = watch();

    const processRowUpdate = (newRow, oldRow) => {
        const rowIndex = values[name].findIndex((row) => row?.id === oldRow.id);
        const newRows = [...values[name]];
        newRows[rowIndex] = newRow;
        setValue(name, newRows);
        return newRow;
    };

    const handleCellClick = useCallback((params) => {
        setCellModesModel((prevModel) => {
            return {
                // Revert the mode of the other cells from other rows
                ...Object.keys(prevModel).reduce(
                    (acc, id) => ({
                        ...acc,
                        [id]: Object.keys(prevModel[id]).reduce(
                            (acc2, field) => ({
                                ...acc2,
                                [field]: { mode: GridCellModes.View },
                            }),
                            {}
                        ),
                    }),
                    {}
                ),
                [params.id]: {
                    // Revert the mode of other cells in the same row
                    ...Object.keys(prevModel[params.id] || {}).reduce(
                        (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
                        {}
                    ),
                    [params.field]: { mode: GridCellModes.Edit },
                },
            };
        });
    }, []);
    // console.log(name, "matixtb2b==", rows);
    return (
        <div style={{ flexGrow: 1, width: '100%', textAlign: 'right' }}>
            <Button variant="outlined" size="small" onClick={() => setShowHeader(!showHeader)}>
                Hide Toolbar
            </Button>
            <Box
                sx={{
                    width: '100%',
                    '& .super-app-theme--header': {
                        backgroundColor: (theme) => theme.palette.primary.main,
                        color: (theme) => theme.palette.primary.contrastText,
                        width: '100%',
                    },
                }}
            >
                <DataGrid
                    autoHeight
                    density="compact"
                    hideFooterPagination
                    rows={rows || []}
                    columns={columns || []}
                    experimentalFeatures={{ newEditingApi: true }}
                    cellModesModel={cellModesModel}
                    onCellModesModelChange={handleCellModesModelChange}
                    onCellClick={handleCellClick}
                    processRowUpdate={(newRow, oldRow) => processRowUpdate(newRow, oldRow, name)}
                    onCellEditStop={(params, event) => {
                        if (params.reason === GridCellEditStopReasons.cellFocusOut) {
                            event.defaultMuiPrevented = true;
                        }
                    }}
                    components={{
                        Toolbar: showHeader ? GridToolbar : undefined,
                    }}
                    disableColumnMenu
                />
            </Box>
        </div>
    );

}
export default StockManageTable;
export const generateVariantsUrl = (productID, userType = 'b2c', allVariantsProps) => {
    const initialUrl = `${productID}?userType=${userType}`;
    const allVar = allVariantsProps.reduce(
        (a, b) => {
            return a?.flatMap((d) => {
                return b?.options?.map((e) => {
                    return [`${d}&${b?.title?.toLowerCase()}=${e?.toLowerCase()}`]?.flat();
                });
            });
        },
        [[]]
    );

    const finalUrlWithVariant = allVar.map((item) => {
        const url = item;
        const finalUrlValue = `${initialUrl}${item}`;
        const variants = item[0]?.split('&')?.slice(1);

        const variantArr = variants?.map((variant) => {
            const [title, value] = variant.split('=');
            return value;
        });

        const variantObj = variants?.map((variant) => {
            const [title, value] = variant.split('=');
            return { title, value };
        });
        return { url: finalUrlValue, variants: variantObj, variantsCombination: variantArr };
    });

    return finalUrlWithVariant;
};

export const createStockTable = (allValues, isEdit) => {

    const variants = allValues.variants || [];
    // console.log("b2cVariants==11", variants);
    const b2cVariants = generateVariantsUrl(allValues?.seoSlug, 'b2c', variants);
    // const b2bVariants = generateVariantsUrl(allValues?.seoSlug, 'b2b', variants);
    // console.log("allValuessss==", allValues?.onlineStock);
    const oldStock = allValues?.onlineStock || [];
    let columns = [];
    const onlineStock = [];

    // if variants is not empty
    if (variants.length > 0) {
        columns = [
            {
                field: 'variant',
                headerName: 'Variant',
                width: 200,
                editable: false,
                headerClassName: 'super-app-theme--header',
            },
            {
                field: 'stockStatus',
                headerName: 'Stock Status',
                editable: true,
                type: 'singleSelect',
                valueOptions: ['Infinite Stock', 'In Stock', 'Out of Stock'],
                width: 250,
                headerClassName: 'super-app-theme--header',
            },
            {
                field: 'availableStock',
                headerName: 'Available Stock',
                type: 'number',
                editable: true,
                width: 250,
                headerClassName: 'super-app-theme--header',
            },

        ];
        //    let tempArr = [];
        b2cVariants.forEach((item, index) => {
            // if (isEdit === true && oldStock[index]?.variant === undefined) {
            //    // console.log(onlineStock,"oldStock[index].variant==",'llllll');
            //    onlineStock = [...onlineStock,{
            //     id: uuidv4(),
            //     variant: item.variantsCombination.join(', '),
            //     stockStatus: 'Infinite Stock',
            //     width: 250,
            //     availableStock: 0,
            // }];
            //     // onlineStock.push({
            //     //     id: uuidv4(),
            //     //     variant: item.variantsCombination.join(', '),
            //     //     stockStatus: 'Infinite Stock',
            //     //     width: 250,
            //     // });
            // }else{
            onlineStock.push({
                id: uuidv4(),
                variant: item.variantsCombination.join(', '),
                variantData: item.variants,
                stockStatus: 'Infinite Stock',
                width: 250,
            });
            // }
        });
        //    console.log("tempArr===",tempArr);
        //  onlineStock.push(tempArr);

    } else {
        columns = [
            {
                field: 'stockStatus',
                headerName: 'Stock Status',
                editable: true,
                type: 'singleSelect',
                valueOptions: ['Infinite Stock', 'In Stock', 'Out of Stock'],
                width: 350,
                headerClassName: 'super-app-theme--header',
            },
            {
                field: 'availableStock',
                headerName: 'Available Stock',
                type: 'number',
                editable: true,
                width: 350,
                headerClassName: 'super-app-theme--header',
            },
        ];
        b2cVariants.forEach((item, index) => {
            onlineStock.push({
                id: uuidv4(),
                // variant: item.variantsCombination.join(', '),      
                stockStatus: 'Infinite Stock',
                width: 350,
            });
        });
    }
    console.log("fsfsfsf=", onlineStock);
    return { onlineStock, onlineStockColumns: columns };
}