/* eslint-disable array-callback-return */
/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
/* eslint-disable arrow-body-style */
import { Box, Button } from '@mui/material';
import { DataGrid, GridCellEditStopReasons, GridCellModes, GridToolbar } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from '../../../../components/snackbar';

VariantsMatrixTable.propTypes = {
  name: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.object),
};

function VariantsMatrixTable({ name, rows, columns }) {

  // console.log("===>", name, rows, columns);
  const { control, setValue, watch, resetField } = useFormContext();
  const [showHeader, setShowHeader] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
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
    console.log(newRow?.mrp, "===>", newRow?.perProductPrice)
    // Check if the entered price is greater than MRP.
    if (parseInt(newRow?.mrp) > parseInt(newRow?.perProductPrice)) {
      const rowIndex = values[name].findIndex((row) => row?.id === oldRow.id);
      const newRows = [...values[name]];
      newRows[rowIndex] = newRow;
      setValue(name, newRows);
      return newRow;
    } else {
      enqueueSnackbar('Please enter Single Price less than to MRP Price', { variant: "error" });
    }
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
  // console.log(name,"matixtb2b==",rows);
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

export default VariantsMatrixTable;

// export function generateVariants(arr) {
//   return arr.reduce((a, b) => a?.flatMap((d) => b?.map((e) => [d, e]?.flat())), [[]]);
// }

export const generateVariantsUrl = (productID, allVariantsProps) => {
  console.log("allVariantsProps=", allVariantsProps);
  // const initialUrl = `${productID}?userType=${userType}`;
  const initialUrl = productID;
  const allVar = allVariantsProps.reduce(
    (a, b, index) => {

      return a?.flatMap((d) => {

        return b?.options?.map((e) => {
          // console.log(d, 'eee===', index);
          // eslint-disable-next-line no-constant-condition, no-self-compare
          if (index === 0) {
            return [`${d}?${b?.title?.toLowerCase()}=${e?.toLowerCase()}`]?.flat();
            // eslint-disable-next-line no-else-return
          } else {
            return [`${d}&${b?.title?.toLowerCase()}=${e?.toLowerCase()}`]?.flat();
          }
        });
      });
    },
    [[]]
  );
  // console.log('eee===', allVar);
  const finalUrlWithVariant = allVar.map((item) => {
    const url = item;
    const sku = item?.sku;
    const finalUrlValue = `${initialUrl}${item}`;
    // const variants = item[0]?.split('&')?.slice(1);
    const queryparam = item[0]?.split('&')?.slice(0);
    const variants = queryparam?.map((param) => param?.replace('?', ''));
    const variantArr = variants?.map((variant) => {
      const [title, value] = variant.split('=');
      return value;
    });


    const variantObj = variants?.map((variant) => {
      const [title, value] = variant.split('=');
      return { title, value };
    });
    console.log('variants=', variantObj);
    return { sku: sku, url: finalUrlValue, variants: variantObj, variantsCombination: variantArr };
  });
  // console.log(allVar, 'finalUrlWithVariant=', finalUrlWithVariant);
  return finalUrlWithVariant;
};
// GENERATE SKU
export const generateUniqueSKU = () => {
  const now = new Date();
  // Additional values you want to include
  // Generate a random five-digit code
  const min = 10000; // Minimum value (inclusive)
  const max = 99999; // Maximum value (inclusive)
  const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
  const additionalValues = randomCode;

  // Format the date-time and additional values into a string
  const uniqueString =
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}` +
    `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}` +
    additionalValues;

  // Convert the string to an integer (assuming it's unique)
  const uniqueNumber = parseInt(uniqueString);

  // Ensure the unique number is 10 digits long
  return uniqueNumber % 10000000000;
}

// CREATE VARIANT MATRIX
export const createMatrixWithVariants = (allValues, isEdit, setValue) => {

  const variants = allValues.variants || [];
  let leadVariant = "";
  if (variants?.length > 0) {
    leadVariant = allValues.leadVariant;
    const filteredImageArr = allValues?.images?.filter(item => item.title !== 'base');

    const leadVariantArray = allValues?.variants?.filter(
      (item) => item?.title.toLowerCase() === allValues?.leadVariant?.toLowerCase()
    );
    const finalFilteredImgArr = filteredImageArr.filter(item => leadVariantArray[0]?.options?.includes(item.title));

    setValue('images', finalFilteredImgArr);
  } else if (variants?.length === 0) {
    const filteredImageArr = allValues?.images?.filter(item => item.title === 'base');
    setValue('images', filteredImageArr);
  }
  // console.log("allValues?.seoSlug=",allValues?.seoSlug);
  const rowsVariants = generateVariantsUrl(allValues?.seoSlug, variants);
  let columns = [];
  const result = [];
  const rows = [];

  // if variants is not empty and qtyvariant is empty then generate variants like (S, M, L) and (Red, Blue, Green)
  if (variants.length > 0) {
    columns = [
      // {
      //   field: 'color',
      //   headerName: 'Color',
      //   width: 80,
      //   renderCell: (params) => (
      //     <div style={{ backgroundColor: params.row.color, width: '100%', height: '100%' }}></div>
      //   ),
      //   headerClassName: 'super-app-theme--header',
      // },
      {
        field: 'variant',
        headerName: 'Variant',
        width: 150,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'sku',
        headerName: 'SKU',
        editable: false,
        width: 150,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'costPrice',
        headerName: 'Cost Price',
        type: 'number',
        editable: true,
        width: 100,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'mrp',
        headerName: 'MRP',
        type: 'number',
        editable: true,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'perProductPrice',
        headerName: 'Single Price',
        type: 'number',
        editable: true,
        width: 100,
        headerClassName: 'super-app-theme--header',
      },
    ];
    rowsVariants.forEach((item, index) => {
      console.log("rows[index].sku=", item.variants);
      // Find the color value in varianData
      const colorVariant = item.variants.find((variant) => variant.title === 'color');
      rows.push({
        id: uuidv4(),
        sku: allValues?.rows[index]?.sku ? allValues?.rows[index]?.sku : generateUniqueSKU(index),
        variant: item.variantsCombination.join(', '),
        url: item.url,
        variantData: item.variants,
        stockStatus: 'In Stock',
        stock: 0,
        costPrice: 0,
        mrp: allValues?.commonMrp || 0,
        perProductPrice: parseFloat(allValues?.perProductPrice) || 0,
        // color: colorVariant ? colorVariant.value : null
      });
    });
  }
  // if qty variant is empty and variant is empty
  if (variants.length === 0) {
    columns = [
      {
        field: 'sku',
        headerName: 'SKU',
        editable: true,
        readOnly: true,
        width: 150,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'costPrice',
        headerName: 'Cost Price',
        type: 'number',
        editable: true,
        width: 100,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'mrp',
        headerName: 'MRP',
        type: 'number',
        editable: true,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'perProductPrice',
        headerName: 'Single Price',
        type: 'number',
        editable: true,
        width: 100,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: '',
        headerName: '',
        width: 100,
        editable: false,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
      },
    ];


    rows.push({
      id: uuidv4(),
      sku: allValues?.rows[0]?.sku ? allValues?.rows[0]?.sku : generateUniqueSKU(),
      stockStatus: 'In Stock',
      stock: 0,
      costPrice: 0,
      mrp: 0,
      perProductPrice: 0,
    });
  }

  // If B2B allowed from the config then add the B2B columns
  // if (b2bMatrix) {
  //   return {
  //     b2cRows,
  //     b2cColumns: B2Ccolumns,

  //     b2bRows,
  //     b2bColumns: B2Bcolumns,
  //   };
  // }

  return { rows, columns };
};
