import { LoadingButton } from '@mui/lab';
import { Button, Stack, TableCell, TableRow } from '@mui/material';
import ConfirmDialog from 'components/confirm-dialog/ConfirmDialog';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Image from '../../../components/image';

StaffTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onReStoreRow: PropTypes.func,
  onDeletePermanentlyRow: PropTypes.func,
};

export default function StaffTableRow({ row, index, onDeletePermanentlyRow, onReStoreRow }) {
  const { _id, name, email_id, contact_no, designation_name, profile, status } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

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
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          {profile ? (
            <Image
              disabledEffect
              alt={name}
              src={profile}
              sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
            />
          ) : (
            <Image
              disabledEffect
              alt={name}
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
            />
          )}
        </TableCell>

        <TableCell>{name}</TableCell>

        <TableCell>{designation_name}</TableCell>

        <TableCell>{contact_no}</TableCell>
        <TableCell>{email_id}</TableCell>

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
