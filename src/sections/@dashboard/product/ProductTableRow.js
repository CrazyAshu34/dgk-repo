/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-boolean-value */
import { Button, Divider, IconButton, MenuItem, Select, TableCell, TableRow } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmDialog from 'components/confirm-dialog/ConfirmDialog';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Iconify from '../../../components/iconify';
import Image from '../../../components/image';
import MenuPopover from '../../../components/menu-popover/MenuPopover';
import { useStatusUpdateProductById, useTypeUpdateProductById, useUpdateProductStockById } from '../../../services/productServices';
import { fCurrency } from '../../../utils/formatNumber';

ProductTableRow.propTypes = {
  row: PropTypes.object,
  tabValue: PropTypes.string,
  index: PropTypes.number,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
};

export default function ProductTableRow({ tabValue, row, index, onEditRow, onDeleteRow }) {
  const [statusPage, setStatusPage] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { _id, title, images, isActive, rows, type } = row;
  console.log("row--=>", isActive);
  const rowValues = row?.rows[0];
  const [productType, setProductType] = useState('Common');
  const [productStock, setProductStock] = useState('Infinity Stock');
  const { updateProduct } = useStatusUpdateProductById();
  const { updateProductStock } = useUpdateProductStockById();
  const { updateProductType, isLoading: updateOrderIsLoading } = useTypeUpdateProductById();
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  useEffect(() => {
    if (isActive === true) {
      setStatusPage(true);
    } else if (isActive === false) {
      setStatusPage(false);
    }
  }, [isActive]);
  useEffect(() => {
    if (type === "COMMON_PRODUCT") {
      setProductType("COMMON_PRODUCT");
    } else if (type === "FEATURED_PRODUCT") {
      setProductType("FEATURED_PRODUCT");
    }
    else if (type === "BEST_SELLER") {
      setProductType("BEST_SELLER");
    }
    else if (type === "NEWLY_LAUNCHED_PRODUCT") {
      setProductType("NEWLY_LAUNCHED_PRODUCT");
    }
  }, [type]);

  const onSubmit = async (data) => {
    setStatusPage(data);
    const payload = {
      _id,
      isActive: data,
    };
    // updateProduct(payload);
    updateProduct(payload, {
      onSuccess: () => queryClient.invalidateQueries(['_statusUpdateProductById']),
    });
  };
  const onChangeProductType = async (data) => {
    setProductType(data);
    const payload = {
      _id,
      type: data,
    };
    updateProductType(payload, {
      onSuccess: () => queryClient.invalidateQueries(['_typeUpdateProductById']),
    });
    // updateProductType(payload);
  };
  const onChangeProductStock = async (data) => {
    setProductStock(data);
    const payload = {
      _id,
      type: data,
    };
    updateProductStock(payload, {
      onSuccess: () => queryClient.invalidateQueries(['_typeUpdateProductById']),
    });
    // updateProductType(payload);
  };
  // console.log('row', visibleToB2B === true || visibleToB2C === true, visibleToB2C);
  //  if (updateOrderIsLoading) return <LoadingScreen />;
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  return (
    <>
      <TableRow hover>
        <TableCell align="left">{index + 1}</TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'left' }}>
          <Image
            disabledEffect
            alt={title}
            src={
              row?.images[0]?.values[0] !== undefined
                ? images[0]?.values[0]?.url
                : 'https://picsum.photos/seed/picsum/200/300'
            }
            sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
          />
        </TableCell>

        <TableCell align="left">{title}</TableCell>
        <TableCell align="center">{rowValues?.mrp}</TableCell>
        <TableCell align="center">{fCurrency(rowValues?.perProductPrice)}</TableCell>
        <TableCell align="center">{rows[0].stock}</TableCell>
        <TableCell align="left">
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            onChange={(e) => onSubmit(e.target.value)}
            value={statusPage}
            sx={{ height: '40px', width: 120 }}
          >
            <MenuItem value={true}>Active</MenuItem>
            <MenuItem value={false}>InActive</MenuItem>

          </Select>
        </TableCell>
        <TableCell align="left">
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            onChange={(e) => onChangeProductType(e.target.value)}
            value={productType}
            sx={{ height: '40px' }}
          >
            <MenuItem value='FEATURED_PRODUCT'>Featured product </MenuItem>
            <MenuItem value='BEST_SELLER'>Best Seller</MenuItem>
            <MenuItem value='NEWLY_LAUNCHED_PRODUCT'>Newly Launched</MenuItem>
            <MenuItem value='COMMON_PRODUCT'>Common Product</MenuItem>
          </Select>
        </TableCell>
        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
        >
          {' '}
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={(e) => {
              onDeleteRow(e);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
