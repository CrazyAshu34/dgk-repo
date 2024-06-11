import { Button, TableCell, TableRow, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { CustomAvatar } from 'components/custom-avatar';
import Iconify from 'components/iconify/Iconify';
import PropTypes from 'prop-types';

CustomerTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default function CustomerTableRow({ row, index, onSubmit, onCancel }) {
  const { _id, name, contact_no, email_id, city, state, status, date } = row;

  return (
    <>
      <TableRow hover>
        <TableCell align="left">{index + 1}</TableCell>

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

        <TableCell align="left">{status}</TableCell>

        <TableCell align="left">{contact_no}</TableCell>

        <TableCell align="left">{email_id}</TableCell>

        <TableCell align="left">{city}</TableCell>

        <TableCell align="left">
          <Button
            variant="contained"
            style={{ background: '' }}
            onClick={() => {
              onSubmit();
              onCancel();
            }}
            startIcon={<Iconify icon="material-symbols:right" />}
          >
            Add
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}
