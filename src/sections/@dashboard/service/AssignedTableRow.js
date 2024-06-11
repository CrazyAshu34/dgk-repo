import { Button, TableCell, TableRow } from '@mui/material';
import Iconify from 'components/iconify/Iconify';
import PropTypes from 'prop-types';
import Image from '../../../components/image';

AssignedTableToolbar.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  onAssignStaff: PropTypes.func,
};

export default function AssignedTableToolbar({ row, index, onSubmit, onCancel, onAssignStaff }) {
  const { _id, name, contact_no, designation_id, designation_name, profile } = row;

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

        <TableCell align="left">
          <Button
            variant="contained"
            style={{ background: '' }}
            
            onClick={() => {
              onSubmit();
              onCancel();
              onAssignStaff();
            }}
            startIcon={<Iconify icon="material-symbols:right" />}
          >
            Add Assigned
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}
