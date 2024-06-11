/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-boolean-value */
import { LoadingButton } from '@mui/lab';
import { Button, Stack, TableCell, TableRow } from '@mui/material';
import ConfirmDialog from 'components/confirm-dialog/ConfirmDialog';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Image from '../../../components/image';

ProductTableRow.propTypes = {
  row: PropTypes.object,
  tabValue: PropTypes.string,
  index: PropTypes.number,
  onReStoreRow: PropTypes.func,
  onDeletePermanentlyRow: PropTypes.func,
};

export default function ProductTableRow({
  tabValue,
  row,
  index,
  onDeletePermanentlyRow,
  onReStoreRow,
}) {
  const { _id, title, partNo, images, isActive, visibleToB2C, visibleToB2B } = row;
  const [openConfirm, setOpenConfirm] = useState(false);
  const rowValues = row?.[`${tabValue}Rows`][0];

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

        {visibleToB2B ? (
          visibleToB2C ? (
            <TableCell align="center">Both</TableCell>
          ) : (
            <TableCell align="center">B2B</TableCell>
          )
        ) : (
          <TableCell align="center">B2C</TableCell>
        )}

        <TableCell align="center">{rowValues?.mrp}</TableCell>
        <TableCell align="center">{rowValues?.perProductPrice}</TableCell>
        <TableCell align="right">
          <Stack direction="row" alignItems="" spacing={2}>
            <LoadingButton
              variant="contained"
              onClick={() => {
                onReStoreRow();
              }}
            >
              Restore
            </LoadingButton>

            <LoadingButton
              variant="contained"
              onClick={() => {
                handleOpenConfirm();
              }}
            >
              Delete Permanently
            </LoadingButton>
          </Stack>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={`Are you sure want to delete? \n All data will be removed along with this data.`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={(e) => {
              onDeletePermanentlyRow(e);
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
