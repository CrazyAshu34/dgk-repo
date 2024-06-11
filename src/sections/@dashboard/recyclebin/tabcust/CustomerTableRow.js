import { LoadingButton } from '@mui/lab';
import { Button, TableCell, TableRow, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import ConfirmDialog from 'components/confirm-dialog/ConfirmDialog';
import { CustomAvatar } from 'components/custom-avatar';
import PropTypes from 'prop-types';
import { useState } from 'react';

CustomerTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onReStoreRow: PropTypes.func,
  onDeletePermanentlyRow: PropTypes.func,
};

export default function CustomerTableRow({ row, index, onDeletePermanentlyRow, onReStoreRow }) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const { cid, _id, name, contact_no, email_id, city } = row;

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

        <TableCell align="left">{cid}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CustomAvatar name={name} />

            <div>
              <Typography variant="subtitle2" noWrap>
                {name}
              </Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell align="left">{contact_no}</TableCell>

        <TableCell align="left">{email_id}</TableCell>

        <TableCell align="left">{city}</TableCell>

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
